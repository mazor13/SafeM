import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { google } from "googleapis";

admin.initializeApp();
const db = admin.firestore();

// --- הגדרות Google OAuth (נמשכות מקובץ ה-.env המקומי) ---
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET; 

const getOAuthClient = (redirectUri?: string) => {
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, redirectUri);
};

// 1. Google: יצירת קישור התחברות
export const getGoogleAuthURL = onCall({ cors: true }, async (request) => {
  const { redirectUri } = request.data;
  const oauth2Client = getOAuthClient(redirectUri);
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', 
    scope: ['https://www.googleapis.com/auth/drive.file'], 
    prompt: 'consent'
  });
  return { url };
});

// 2. Google: החלפת קוד בטוקן
export const exchangeGoogleCode = onCall({ cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Auth Required");
  const { code, clientId, redirectUri } = request.data; 
  try {
    const oauth2Client = getOAuthClient(redirectUri);
    const { tokens } = await oauth2Client.getToken(code);
    await db.collection('tenants').doc(clientId).set({
      googleDriveToken: tokens.refresh_token,
      googleDriveConnected: true, 
      updatedAt: new Date(),
    }, { merge: true });
    return { success: true };
  } catch (error: any) { throw new HttpsError("internal", error.message); }
});

// 3. פונקציה לבדיקת חיבורים רגילים (S3, FTP, OneDrive)
export const verifyStorageConnection = onCall({ cors: true }, async (request) => {
  const { type, config } = request.data;
  
  if (type === 's3') {
      if (!config.accessKey || !config.secretKey) return { status: 400, error: "חסרים מפתחות גישה" };
      return { status: 200, message: "S3 Connection Verified (Simulation)" };
  }
  if (type === 'local_server') {
      if (!config.host || !config.username) return { status: 400, error: "חסרים פרטי שרת" };
      return { status: 200, message: "SFTP Handshake OK (Simulation)" };
  }
  return { status: 200, message: "Connection OK" };
});

// 4. פונקציית העלאה אוניברסלית
export const performTestUpload = onCall({ cors: true, timeoutSeconds: 60 }, async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Auth Required");
  const { type, config } = request.data; 
  const timestamp = new Date().toISOString();
  const fileName = `AEGIS_TEST_${timestamp}.txt`;

  try {
    if (type === 'google_drive_oauth') {
        const tenantDoc = await db.collection('tenants').doc(config.clientId).get();
        const refreshToken = tenantDoc.data()?.googleDriveToken;
        if (!refreshToken) throw new HttpsError("failed-precondition", "Missing Token");

        const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
        oauth2Client.setCredentials({ refresh_token: refreshToken });
        const drive = google.drive({ version: 'v3', auth: oauth2Client });

        let folderId;
        const folderRes = await drive.files.list({
            q: `name = 'AEGIS_DATA' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
            fields: 'files(id)',
        });
        if (folderRes.data.files && folderRes.data.files.length > 0) {
            folderId = folderRes.data.files[0].id;
        } else {
            const newFolder = await drive.files.create({
                requestBody: { name: 'AEGIS_DATA', mimeType: 'application/vnd.google-apps.folder' }, 
                fields: 'id'
            });
            folderId = newFolder.data.id;
        }

        const file = await drive.files.create({
            requestBody: { name: fileName, parents: [folderId!] },
            media: { mimeType: 'text/plain', body: `Saved in AEGIS_DATA.\nTime: ${timestamp}` },
            fields: 'id, webViewLink',
        });
        return { success: true, fileUrl: (file.data as any).webViewLink, fileName };
    }

    return { success: true, message: "Simulated Upload to " + type, fileName };

  } catch (error: any) {
    console.error("Upload Error:", error);
    throw new HttpsError("internal", error.message);
  }
});
