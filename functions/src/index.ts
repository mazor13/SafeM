import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { KeyManagementServiceClient } from "@google-cloud/kms";
import * as crypto from "crypto";

// Initialize Firebase Admin SDK
admin.initializeApp();
const firestore = admin.firestore();
const storage = admin.storage();

// Initialize KMS client
const kmsClient = new KeyManagementServiceClient();

/**
 * Generate PDF Report Cloud Function (Gen-2)
 * 
 * This function generates a PDF report for an inspection, signs it with KMS,
 * and stores it in Firebase Storage with metadata in Firestore.
 * 
 * Region: us-central1
 */
export const generatePdfReport = onRequest(
  { region: "us-central1" },
  async (req, res) => {
    try {
      logger.info("generatePdfReport function invoked", { method: req.method });

      // Validate request method
      if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed. Use POST." });
        return;
      }

      // Extract inspection ID from request body
      const { inspectionId, title, content } = req.body;

      if (!inspectionId) {
        res.status(400).json({ error: "Missing required field: inspectionId" });
        return;
      }

      logger.info("Generating PDF report", { inspectionId });

      // Create PDF document using pdf-lib
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // A4 size in points
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Add title
      const fontSize = 24;
      const titleText = title || `Inspection Report: ${inspectionId}`;
      page.drawText(titleText, {
        x: 50,
        y: 792,
        size: fontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      // Add content
      const contentText = content || "This is a sample inspection report.";
      page.drawText(contentText, {
        x: 50,
        y: 750,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });

      // Add timestamp
      const timestamp = new Date().toISOString();
      page.drawText(`Generated: ${timestamp}`, {
        x: 50,
        y: 50,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      });

      // Serialize PDF to bytes
      const pdfBytes = await pdfDoc.save();

      // Calculate SHA-256 hash of the PDF content
      const hash = crypto.createHash("sha256");
      hash.update(pdfBytes);
      const documentHash = hash.digest("hex");

      logger.info("PDF generated and hashed", { 
        inspectionId, 
        hash: documentHash,
        size: pdfBytes.length 
      });

      // Sign the hash using Google Cloud KMS
      const kmsKeyName = process.env.KMS_KEY_NAME;
      let signature = "";

      if (kmsKeyName) {
        // Validate KMS key name format
        const kmsKeyPattern = /^projects\/[^/]+\/locations\/[^/]+\/keyRings\/[^/]+\/cryptoKeys\/[^/]+\/cryptoKeyVersions\/[^/]+$/;
        if (!kmsKeyPattern.test(kmsKeyName)) {
          logger.warn("Invalid KMS_KEY_NAME format", { kmsKeyName });
          signature = "INVALID_KMS_KEY_FORMAT";
        } else {
          try {
            // Create SHA-256 digest directly from PDF bytes
            const hash256 = crypto.createHash("sha256");
            hash256.update(pdfBytes);
            const digest = hash256.digest();

            const [signResponse] = await kmsClient.asymmetricSign({
              name: kmsKeyName,
              digest: {
                sha256: digest,
              },
            });

            signature = signResponse.signature
              ? Buffer.from(signResponse.signature).toString("base64")
              : "";
            
            logger.info("Document signed with KMS", { inspectionId });
          } catch (kmsError) {
            logger.error("KMS signing failed", { 
              inspectionId, 
              error: kmsError instanceof Error ? kmsError.message : String(kmsError)
            });
            // Continue without signature in case of KMS error
            signature = "KMS_SIGNING_FAILED";
          }
        }
      } else {
        logger.warn("KMS_KEY_NAME not configured, skipping signature", { inspectionId });
        signature = "NOT_SIGNED";
      }

      // Upload PDF to Firebase Storage
      const bucket = storage.bucket();
      const fileName = `reports/${inspectionId}.pdf`;
      const file = bucket.file(fileName);

      // Validate file size (max 10MB)
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      if (pdfBytes.length > maxFileSize) {
        logger.error("PDF file too large", { 
          inspectionId, 
          size: pdfBytes.length,
          maxSize: maxFileSize 
        });
        res.status(413).json({ 
          error: "PDF file too large",
          size: pdfBytes.length,
          maxSize: maxFileSize 
        });
        return;
      }

      try {
        await file.save(Buffer.from(pdfBytes), {
          contentType: "application/pdf",
          metadata: {
            metadata: {
              inspectionId,
              generatedAt: timestamp,
              hash: documentHash,
            },
          },
        });

        logger.info("PDF uploaded to Storage", { inspectionId, fileName });
      } catch (uploadError) {
        logger.error("Failed to upload PDF to Storage", { 
          inspectionId, 
          error: uploadError instanceof Error ? uploadError.message : String(uploadError)
        });
        throw uploadError;
      }

      // Save metadata to Firestore
      const docRef = firestore.collection("documents").doc();
      await docRef.set({
        inspectionId,
        fileName,
        storagePath: fileName,
        hash: documentHash,
        signature,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        type: "inspection_report",
        size: pdfBytes.length,
      });

      logger.info("Metadata saved to Firestore", { 
        inspectionId, 
        documentId: docRef.id 
      });

      // Return success response
      res.status(200).json({
        success: true,
        inspectionId,
        documentId: docRef.id,
        fileName,
        hash: documentHash,
        size: pdfBytes.length,
        signed: signature !== "NOT_SIGNED" && signature !== "KMS_SIGNING_FAILED",
      });

    } catch (error) {
      logger.error("Error generating PDF report", { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);
