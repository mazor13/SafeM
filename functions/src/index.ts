import { onRequest } from "firebase-functions/v2/https";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

import * as nodemailer from "nodemailer";
import { defineSecret } from "firebase-functions/params";

const gmailUser = defineSecret("GMAIL_USER");
const gmailPassword = defineSecret("GMAIL_APP_PASSWORD");
// =====================================================
// 1. Google Auth URL Generator
// =====================================================
export const getGoogleAuthURL = onRequest(
  { cors: true, region: "us-central1" },
  async (req, res) => {
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 
      "https://us-central1-ozen-staging-2025.cloudfunctions.net/exchangeGoogleCode";

    if (!CLIENT_ID) {
      res.status(500).json({ error: "Missing GOOGLE_CLIENT_ID" });
      return;
    }

    const scopes = [
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/userinfo.email"
    ].join(" ");

    const authUrl = "https://accounts.google.com/o/oauth2/v2/auth?" +
      "client_id=" + CLIENT_ID +
      "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) +
      "&response_type=code" +
      "&scope=" + encodeURIComponent(scopes) +
      "&access_type=offline" +
      "&prompt=consent";

    res.json({ url: authUrl });
  }
);

// =====================================================
// 2. Exchange Google Code for Tokens
// =====================================================
export const exchangeGoogleCode = onRequest(
  { cors: true, region: "us-central1" },
  async (req, res) => {
    const code = req.query.code as string;
    
    if (!code) {
      res.status(400).send("Missing authorization code");
      return;
    }

    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI ||
      "https://us-central1-ozen-staging-2025.cloudfunctions.net/exchangeGoogleCode";

    try {
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: CLIENT_ID || "",
          client_secret: CLIENT_SECRET || "",
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code"
        })
      });

      const tokens = await tokenResponse.json();

      res.send(
        "<html><body><script>" +
        "window.opener.postMessage(" + JSON.stringify(tokens) + ", '*');" +
        "window.close();" +
        "</script><p>Authorization successful. This window will close automatically.</p></body></html>"
      );
    } catch (error) {
      console.error("Token exchange error:", error);
      res.status(500).send("Failed to exchange authorization code");
    }
  }
);

// =====================================================
// 3. Verify Storage Connection
// =====================================================
export const verifyStorageConnection = onCall(
  { cors: true, region: "us-central1" },
  async (request) => {
    const { accessToken, storageType, folderId } = request.data;

    if (storageType === "google_drive") {
      try {
        const response = await fetch(
          "https://www.googleapis.com/drive/v3/files/" + folderId + "?fields=id,name",
          {
            headers: { Authorization: "Bearer " + accessToken }
          }
        );

        if (!response.ok) {
          const error = await response.json();
          return { 
            success: false, 
            error: error.error?.message || "Failed to access folder" 
          };
        }

        const folder = await response.json();
        return { 
          success: true, 
          folderName: folder.name,
          message: "Successfully connected to folder: " + folder.name 
        };
      } catch (error) {
        return { 
          success: false, 
          error: "Network error while verifying connection" 
        };
      }
    }

    return { success: false, error: "Unsupported storage type" };
  }
);

// =====================================================
// 4. Universal File Upload (Google Drive / S3 / Local)
// =====================================================
export const performTestUpload = onCall(
  { cors: true, region: "us-central1" },
  async (request) => {
    const { accessToken, storageType, folderId, fileName, fileContent, mimeType } = request.data;

    if (storageType === "google_drive") {
      try {
        const metadata = {
          name: fileName,
          parents: [folderId]
        };

        const boundary = "-------SafeMBoundary";
        const body = 
          "--" + boundary + "\r\n" +
          "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
          JSON.stringify(metadata) + "\r\n" +
          "--" + boundary + "\r\n" +
          "Content-Type: " + mimeType + "\r\n" +
          "Content-Transfer-Encoding: base64\r\n\r\n" +
          fileContent + "\r\n" +
          "--" + boundary + "--";

        const response = await fetch(
          "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "multipart/related; boundary=" + boundary
            },
            body
          }
        );

        if (!response.ok) {
          const error = await response.json();
          return { 
            success: false, 
            error: error.error?.message || "Upload failed" 
          };
        }

        const file = await response.json();
        return { 
          success: true, 
          fileId: file.id,
          fileName: file.name,
          message: "File uploaded successfully: " + file.name 
        };
      } catch (error) {
        return { 
          success: false, 
          error: "Network error during upload" 
        };
      }
    }

    return { success: false, error: "Unsupported storage type" };
  }
);

// =====================================================
// 5. Generate Inspection PDF with Puppeteer
// =====================================================
export const generateInspectionPDF = onCall(
  { 
    cors: true, 
    region: "us-central1",
    timeoutSeconds: 120,
    memory: "1GiB"
  },
  async (request) => {
    const { inspection } = request.data;

    if (!inspection) {
      throw new HttpsError("invalid-argument", "Missing inspection data");
    }

    try {
      const htmlContent = buildInspectionHTML(inspection);

      const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" }
      });

      await browser.close();

      const base64Pdf = Buffer.from(pdfBuffer).toString("base64");
      
      const date = new Date().toLocaleDateString("he-IL").replace(/\./g, "-");
      const clientName = inspection.clientName?.replace(/\s+/g, "_") || "client";
      const filename = "SafeM_" + clientName + "_" + date + ".pdf";

      return {
        success: true,
        pdf: base64Pdf,
        filename
      };

    } catch (error) {
      console.error("PDF Generation Error:", error);
      throw new HttpsError("internal", "Failed to generate PDF: " + error);
    }
  }
);

function buildInspectionHTML(inspection: any): string {
  const date = new Date().toLocaleDateString("he-IL");
  const time = new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });

  let passCount = 0;
  let failCount = 0;
  let totalAnswered = 0;

  if (inspection.answers) {
    Object.values(inspection.answers).forEach((answer: any) => {
      if (answer === "pass") { passCount++; totalAnswered++; }
      else if (answer === "fail") { failCount++; totalAnswered++; }
      else if (answer && answer !== "") { totalAnswered++; }
    });
  }

  const score = totalAnswered > 0 ? Math.round((passCount / totalAnswered) * 100) : 0;

  let sectionsHTML = "";
  if (inspection.templateSnapshot) {
    inspection.templateSnapshot.forEach((section: any) => {
      sectionsHTML += '<div class="section">';
      sectionsHTML += '<div class="section-title">' + section.title + '</div>';
      sectionsHTML += '<table><thead><tr>';
      sectionsHTML += '<th style="width: 50px;">#</th>';
      sectionsHTML += '<th>פריט בדיקה</th>';
      sectionsHTML += '<th style="width: 120px;">תוצאה</th>';
      sectionsHTML += '</tr></thead><tbody>';

      section.items.forEach((item: any, index: number) => {
        const answer = inspection.answers?.[item.id];
        let statusText = "לא נבדק";
        let statusClass = "status-na";

        if (answer === "pass") {
          statusText = "תקין ✓";
          statusClass = "status-pass";
        } else if (answer === "fail") {
          statusText = "לקוי ✗";
          statusClass = "status-fail";
        } else if (answer && answer !== "") {
          statusText = typeof answer === "string" && answer.startsWith("http") ? "תמונה" : answer;
          statusClass = "status-partial";
        }

        sectionsHTML += '<tr>';
        sectionsHTML += '<td style="text-align: center;">' + (index + 1) + '</td>';
        sectionsHTML += '<td>' + item.text + (item.required ? ' <span style="color: red;">*</span>' : '') + '</td>';
        sectionsHTML += '<td class="' + statusClass + '">' + statusText + '</td>';
        sectionsHTML += '</tr>';
      });

      sectionsHTML += '</tbody></table></div>';
    });
  }

  const templateName = inspection.templateName || "בדיקה";
  const clientName = inspection.clientName || "לא צוין";
  const siteName = inspection.siteName || "לא צוין";
  const statusText = inspection.status === "completed" ? "הושלם" : "בתהליך";

  return '<!DOCTYPE html>' +
    '<html dir="rtl" lang="he">' +
    '<head>' +
    '<meta charset="UTF-8">' +
    '<style>' +
    '@import url("https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap");' +
    '* { margin: 0; padding: 0; box-sizing: border-box; }' +
    'body { font-family: "Heebo", Arial, sans-serif; direction: rtl; padding: 30px; color: #1f2937; font-size: 12px; line-height: 1.5; }' +
    '.header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px; }' +
    '.header h1 { font-size: 22px; font-weight: 700; margin-bottom: 5px; }' +
    '.header p { opacity: 0.9; font-size: 14px; }' +
    '.info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px; }' +
    '.info-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; }' +
    '.info-box label { font-size: 11px; color: #6b7280; display: block; margin-bottom: 4px; }' +
    '.info-box value { font-size: 14px; font-weight: 600; color: #111827; }' +
    '.score-box { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-align: center; padding: 20px; border-radius: 12px; margin-bottom: 25px; }' +
    '.score-box .score { font-size: 48px; font-weight: 700; }' +
    '.score-box .label { font-size: 14px; opacity: 0.9; }' +
    '.section { margin-bottom: 25px; }' +
    '.section-title { background: #4f46e5; color: white; padding: 10px 15px; font-size: 14px; font-weight: 600; border-radius: 8px 8px 0 0; }' +
    'table { width: 100%; border-collapse: collapse; background: white; border: 1px solid #e5e7eb; border-top: none; }' +
    'th, td { padding: 10px 12px; text-align: right; border-bottom: 1px solid #e5e7eb; }' +
    'th { background: #f9fafb; font-weight: 600; font-size: 11px; color: #6b7280; }' +
    'tr:last-child td { border-bottom: none; }' +
    '.status-pass { background: #d1fae5; color: #065f46; font-weight: 600; text-align: center; border-radius: 4px; }' +
    '.status-fail { background: #fee2e2; color: #991b1b; font-weight: 600; text-align: center; border-radius: 4px; }' +
    '.status-partial { background: #fef3c7; color: #92400e; text-align: center; }' +
    '.status-na { background: #f3f4f6; color: #6b7280; text-align: center; }' +
    '.footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 10px; }' +
    '</style>' +
    '</head>' +
    '<body>' +
    '<div class="header">' +
    '<h1>דוח בדיקה - ' + templateName + '</h1>' +
    '<p>נוצר ע"י SafeM | ' + date + ' ' + time + '</p>' +
    '</div>' +
    '<div class="info-grid">' +
    '<div class="info-box"><label>לקוח</label><value>' + clientName + '</value></div>' +
    '<div class="info-box"><label>אתר</label><value>' + siteName + '</value></div>' +
    '<div class="info-box"><label>סטטוס</label><value>' + statusText + '</value></div>' +
    '</div>' +
    '<div class="score-box">' +
    '<div class="score">' + score + '%</div>' +
    '<div class="label">ציון כללי (' + passCount + ' תקין / ' + failCount + ' לקוי)</div>' +
    '</div>' +
    sectionsHTML +
    '<div class="footer">מסמך זה נוצר אוטומטית ע"י מערכת SafeM | ' + date + ' ' + time + '</div>' +
    '</body>' +
    '</html>';
}

// =====================================================
// 6. Send Email Notification
// =====================================================


export const sendEmailNotification = onCall(
  { 
    cors: true, 
    region: "us-central1",
    secrets: [gmailUser, gmailPassword]
  },
  async (request) => {
    const { to, subject, type, data } = request.data;

    if (!to || !subject || !type) {
      throw new HttpsError("invalid-argument", "Missing required fields: to, subject, type");
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser.value(),
          pass: gmailPassword.value()
        }
      });

      const htmlContent = buildEmailHTML(type, data);

      const mailOptions = {
        from: '"AEGIS Safety" <' + gmailUser.value() + '>',
        to,
        subject,
        html: htmlContent
      };

      await transporter.sendMail(mailOptions);

      return { 
        success: true, 
        message: "Email sent successfully to " + to 
      };

    } catch (error) {
      console.error("Email send error:", error);
      throw new HttpsError("internal", "Failed to send email: " + error);
    }
  }
);

function buildEmailHTML(type: string, data: any): string {
  const baseStyle = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap');
      body { font-family: 'Heebo', Arial, sans-serif; direction: rtl; margin: 0; padding: 0; background: #f5f5f5; }
      .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
      .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; }
      .header h1 { margin: 0; font-size: 24px; }
      .content { padding: 30px; }
      .info-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 15px 0; }
      .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
      .info-row:last-child { border-bottom: none; }
      .label { color: #6b7280; }
      .value { font-weight: 600; color: #111827; }
      .btn { display: inline-block; background: #4f46e5; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
      .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
      .status-pass { color: #059669; font-weight: 600; }
      .status-fail { color: #dc2626; font-weight: 600; }
    </style>
  `;

  switch (type) {
    case "finding_created":
      return `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head><meta charset="UTF-8">${baseStyle}</head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔍 ממצא חדש נוצר</h1>
            </div>
            <div class="content">
              <p>שלום,</p>
              <p>ממצא חדש נוצר במערכת AEGIS:</p>
              <div class="info-box">
                <div class="info-row"><span class="label">כותרת:</span><span class="value">${data.title || "לא צוין"}</span></div>
                <div class="info-row"><span class="label">חומרה:</span><span class="value ${data.severity === "critical" ? "status-fail" : ""}">${data.severityText || data.severity || "לא צוין"}</span></div>
                <div class="info-row"><span class="label">לקוח:</span><span class="value">${data.clientName || "לא צוין"}</span></div>
                <div class="info-row"><span class="label">אתר:</span><span class="value">${data.siteName || "לא צוין"}</span></div>
              </div>
              <p>${data.description || ""}</p>
            </div>
            <div class="footer">
              <p>הודעה זו נשלחה אוטומטית ממערכת AEGIS Safety</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case "inspection_complete":
      return `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head><meta charset="UTF-8">${baseStyle}</head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ בדיקה הושלמה</h1>
            </div>
            <div class="content">
              <p>שלום,</p>
              <p>בדיקה הושלמה בהצלחה:</p>
              <div class="info-box">
                <div class="info-row"><span class="label">סוג בדיקה:</span><span class="value">${data.templateName || "לא צוין"}</span></div>
                <div class="info-row"><span class="label">לקוח:</span><span class="value">${data.clientName || "לא צוין"}</span></div>
                <div class="info-row"><span class="label">אתר:</span><span class="value">${data.siteName || "לא צוין"}</span></div>
                <div class="info-row"><span class="label">ציון:</span><span class="value ${data.score >= 80 ? "status-pass" : "status-fail"}">${data.score || 0}%</span></div>
                <div class="info-row"><span class="label">תקין:</span><span class="value status-pass">${data.passCount || 0}</span></div>
                <div class="info-row"><span class="label">לקוי:</span><span class="value status-fail">${data.failCount || 0}</span></div>
              </div>
            </div>
            <div class="footer">
              <p>הודעה זו נשלחה אוטומטית ממערכת AEGIS Safety</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case "task_assigned":
      return `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head><meta charset="UTF-8">${baseStyle}</head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 משימה חדשה הוקצתה לך</h1>
            </div>
            <div class="content">
              <p>שלום ${data.assigneeName || ""},</p>
              <p>משימה חדשה הוקצתה לך:</p>
              <div class="info-box">
                <div class="info-row"><span class="label">משימה:</span><span class="value">${data.taskTitle || "לא צוין"}</span></div>
                <div class="info-row"><span class="label">תאריך יעד:</span><span class="value">${data.dueDate || "לא צוין"}</span></div>
                <div class="info-row"><span class="label">עדיפות:</span><span class="value">${data.priority || "רגילה"}</span></div>
              </div>
              <p>${data.description || ""}</p>
            </div>
            <div class="footer">
              <p>הודעה זו נשלחה אוטומטית ממערכת AEGIS Safety</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case "reminder":
      return `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head><meta charset="UTF-8">${baseStyle}</head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ תזכורת</h1>
            </div>
            <div class="content">
              <p>שלום,</p>
              <p>${data.message || "יש לך פריטים הדורשים טיפול"}</p>
              <div class="info-box">
                <div class="info-row"><span class="label">נושא:</span><span class="value">${data.title || "לא צוין"}</span></div>
                <div class="info-row"><span class="label">תאריך יעד:</span><span class="value">${data.dueDate || "לא צוין"}</span></div>
              </div>
            </div>
            <div class="footer">
              <p>הודעה זו נשלחה אוטומטית ממערכת AEGIS Safety</p>
            </div>
          </div>
        </body>
        </html>
      `;

    default:
      return `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head><meta charset="UTF-8">${baseStyle}</head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 הודעה מ-AEGIS</h1>
            </div>
            <div class="content">
              <p>${data.message || "הודעה ממערכת AEGIS"}</p>
            </div>
            <div class="footer">
              <p>הודעה זו נשלחה אוטומטית ממערכת AEGIS Safety</p>
            </div>
          </div>
        </body>
        </html>
      `;
  }
}

// =====================================================
// 7. Automatic Reminders (Scheduled Function)
// =====================================================
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

interface Equipment {
  id: string;
  name: string;
  type: string;
  nextInspection: admin.firestore.Timestamp | null;
  clientId: string;
  siteId?: string;
  serialNumber?: string;
}

interface ReminderLog {
  equipmentId: string;
  equipmentName: string;
  clientId: string;
  tenantId: string;
  daysUntilDue: number;
  sentAt: admin.firestore.Timestamp;
  emailTo: string;
  success: boolean;
  error?: string;
}

// Run every day at 8:00 AM Israel time
export const sendDailyReminders = onSchedule(
  {
    schedule: "0 8 * * *",
    timeZone: "Asia/Jerusalem",
    region: "us-central1",
    secrets: [gmailUser, gmailPassword]
  },
  async (event) => {
    console.log("Starting daily reminders job...");
    
    const now = new Date();
    const remindDays = [7, 3, 1]; // Send reminders 7, 3, and 1 days before
    const results: { sent: number; failed: number; skipped: number } = { sent: 0, failed: 0, skipped: 0 };

    try {
      // Get all tenants
      const tenantsSnapshot = await db.collection("tenants").get();
      
      for (const tenantDoc of tenantsSnapshot.docs) {
        const tenantId = tenantDoc.id;
        const tenantData = tenantDoc.data();
        const tenantEmail = tenantData.email || tenantData.ownerEmail;
        
        if (!tenantEmail) {
          console.log(`Tenant ${tenantId} has no email, skipping`);
          continue;
        }

        // Get all equipment for this tenant
        const equipmentSnapshot = await db
          .collection("tenants")
          .doc(tenantId)
          .collection("equipment")
          .where("nextInspection", "!=", null)
          .get();

        for (const equipDoc of equipmentSnapshot.docs) {
          const equipment = { id: equipDoc.id, ...equipDoc.data() } as Equipment;
          
          if (!equipment.nextInspection) continue;

          const nextInspectionDate = equipment.nextInspection.toDate();
          const daysUntil = Math.ceil((nextInspectionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

          // Check if we should send a reminder for this day
          if (remindDays.includes(daysUntil)) {
            // Check if we already sent a reminder for this equipment today
            const existingReminder = await db
              .collection("tenants")
              .doc(tenantId)
              .collection("reminderLogs")
              .where("equipmentId", "==", equipment.id)
              .where("daysUntilDue", "==", daysUntil)
              .where("sentAt", ">=", admin.firestore.Timestamp.fromDate(
                new Date(now.getFullYear(), now.getMonth(), now.getDate())
              ))
              .get();

            if (!existingReminder.empty) {
              console.log(`Already sent ${daysUntil}-day reminder for ${equipment.name}`);
              results.skipped++;
              continue;
            }

            // Get client name
            let clientName = "לקוח";
            if (equipment.clientId) {
              const clientDoc = await db
                .collection("tenants")
                .doc(tenantId)
                .collection("clients")
                .doc(equipment.clientId)
                .get();
              if (clientDoc.exists) {
                clientName = clientDoc.data()?.name || "לקוח";
              }
            }

            // Send the reminder email
            try {
              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: gmailUser.value(),
                  pass: gmailPassword.value()
                }
              });

              const urgencyText = daysUntil === 1 ? "⚠️ מחר!" : daysUntil === 3 ? "בעוד 3 ימים" : "בעוד שבוע";
              const subject = `תזכורת: בדיקה קרובה לציוד "${equipment.name}" - ${urgencyText}`;

              const htmlContent = buildReminderHTML({
                equipmentName: equipment.name,
                equipmentType: equipment.type || "לא צוין",
                serialNumber: equipment.serialNumber || "לא צוין",
                clientName,
                dueDate: nextInspectionDate.toLocaleDateString("he-IL"),
                daysUntil,
                urgencyText
              });

              await transporter.sendMail({
                from: '"AEGIS Safety" <' + gmailUser.value() + '>',
                to: tenantEmail,
                subject,
                html: htmlContent
              });

              // Log the reminder
              const reminderLog: ReminderLog = {
                equipmentId: equipment.id,
                equipmentName: equipment.name,
                clientId: equipment.clientId,
                tenantId,
                daysUntilDue: daysUntil,
                sentAt: admin.firestore.Timestamp.now(),
                emailTo: tenantEmail,
                success: true
              };

              await db
                .collection("tenants")
                .doc(tenantId)
                .collection("reminderLogs")
                .add(reminderLog);

              console.log(`Sent ${daysUntil}-day reminder for ${equipment.name} to ${tenantEmail}`);
              results.sent++;

            } catch (emailError) {
              console.error(`Failed to send reminder for ${equipment.name}:`, emailError);
              
              // Log the failure
              await db
                .collection("tenants")
                .doc(tenantId)
                .collection("reminderLogs")
                .add({
                  equipmentId: equipment.id,
                  equipmentName: equipment.name,
                  clientId: equipment.clientId,
                  tenantId,
                  daysUntilDue: daysUntil,
                  sentAt: admin.firestore.Timestamp.now(),
                  emailTo: tenantEmail,
                  success: false,
                  error: String(emailError)
                });

              results.failed++;
            }
          }
        }
      }

      console.log(`Daily reminders completed: ${results.sent} sent, ${results.failed} failed, ${results.skipped} skipped`);
      
    } catch (error) {
      console.error("Daily reminders job failed:", error);
      throw error;
    }
  }
);

function buildReminderHTML(data: {
  equipmentName: string;
  equipmentType: string;
  serialNumber: string;
  clientName: string;
  dueDate: string;
  daysUntil: number;
  urgencyText: string;
}): string {
  const urgencyColor = data.daysUntil === 1 ? "#dc2626" : data.daysUntil === 3 ? "#f59e0b" : "#3b82f6";
  
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap');
        body { font-family: 'Heebo', Arial, sans-serif; direction: rtl; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, ${urgencyColor} 0%, ${urgencyColor}dd 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .urgency-badge { display: inline-block; background: white; color: ${urgencyColor}; padding: 8px 16px; border-radius: 20px; font-weight: 700; margin-top: 15px; font-size: 18px; }
        .content { padding: 30px; }
        .info-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 15px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .info-row:last-child { border-bottom: none; }
        .label { color: #6b7280; }
        .value { font-weight: 600; color: #111827; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        .highlight { color: ${urgencyColor}; font-weight: 700; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ תזכורת לבדיקה קרובה</h1>
          <div class="urgency-badge">${data.urgencyText}</div>
        </div>
        <div class="content">
          <p>שלום,</p>
          <p>זוהי תזכורת כי יש לבצע בדיקה לציוד הבא בקרוב:</p>
          <div class="info-box">
            <div class="info-row"><span class="label">שם הציוד:</span><span class="value">${data.equipmentName}</span></div>
            <div class="info-row"><span class="label">סוג:</span><span class="value">${data.equipmentType}</span></div>
            <div class="info-row"><span class="label">מס' סידורי:</span><span class="value">${data.serialNumber}</span></div>
            <div class="info-row"><span class="label">לקוח:</span><span class="value">${data.clientName}</span></div>
            <div class="info-row"><span class="label">תאריך בדיקה:</span><span class="value highlight">${data.dueDate}</span></div>
          </div>
          <p>אנא ודא שהבדיקה מתוזמנת ושכל ההכנות בוצעו.</p>
        </div>
        <div class="footer">
          <p>הודעה זו נשלחה אוטומטית ממערכת AEGIS Safety</p>
          <p>ניתן לשנות את הגדרות התזכורות בהגדרות המערכת</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Manual trigger for testing reminders
export const triggerRemindersManually = onCall(
  {
    cors: true,
    region: "us-central1",
    secrets: [gmailUser, gmailPassword]
  },
  async (request) => {
    console.log("Manual reminder trigger started...");
    
    const { tenantId, testEmail } = request.data;
    
    if (!tenantId) {
      throw new HttpsError("invalid-argument", "Missing tenantId");
    }

    const now = new Date();
    const results: { equipment: string; daysUntil: number; sent: boolean; error?: string }[] = [];

    try {
      // Get equipment for this tenant
      const equipmentSnapshot = await db
        .collection("tenants")
        .doc(tenantId)
        .collection("equipment")
        .where("nextInspection", "!=", null)
        .get();

      const tenantDoc = await db.collection("tenants").doc(tenantId).get();
      const tenantEmail = testEmail || tenantDoc.data()?.email || tenantDoc.data()?.ownerEmail;

      if (!tenantEmail) {
        throw new HttpsError("failed-precondition", "No email configured for tenant");
      }

      for (const equipDoc of equipmentSnapshot.docs) {
        const equipment = { id: equipDoc.id, ...equipDoc.data() } as Equipment;
        
        if (!equipment.nextInspection) continue;

        const nextInspectionDate = equipment.nextInspection.toDate();
        const daysUntil = Math.ceil((nextInspectionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // For testing, include if within 30 days or if daysOverride matches
        if (daysUntil > 0 && daysUntil <= 30) {
          let clientName = "לקוח";
          if (equipment.clientId) {
            const clientDoc = await db
              .collection("tenants")
              .doc(tenantId)
              .collection("clients")
              .doc(equipment.clientId)
              .get();
            if (clientDoc.exists) {
              clientName = clientDoc.data()?.name || "לקוח";
            }
          }

          try {
            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: gmailUser.value(),
                pass: gmailPassword.value()
              }
            });

            const urgencyText = daysUntil === 1 ? "⚠️ מחר!" : daysUntil <= 3 ? `בעוד ${daysUntil} ימים` : `בעוד ${daysUntil} ימים`;
            const subject = `[TEST] תזכורת: בדיקה קרובה לציוד "${equipment.name}" - ${urgencyText}`;

            const htmlContent = buildReminderHTML({
              equipmentName: equipment.name,
              equipmentType: equipment.type || "לא צוין",
              serialNumber: equipment.serialNumber || "לא צוין",
              clientName,
              dueDate: nextInspectionDate.toLocaleDateString("he-IL"),
              daysUntil,
              urgencyText
            });

            await transporter.sendMail({
              from: '"AEGIS Safety" <' + gmailUser.value() + '>',
              to: tenantEmail,
              subject,
              html: htmlContent
            });

            results.push({ equipment: equipment.name, daysUntil, sent: true });
          } catch (err) {
            results.push({ equipment: equipment.name, daysUntil, sent: false, error: String(err) });
          }
        }
      }

      return {
        success: true,
        emailTo: tenantEmail,
        results
      };

    } catch (error) {
      console.error("Manual reminder trigger failed:", error);
      throw new HttpsError("internal", "Failed to trigger reminders: " + error);
    }
  }
);
