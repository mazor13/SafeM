import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import admin from 'firebase-admin';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import crypto from 'crypto';
import { KeyManagementServiceClient } from '@google-cloud/kms';

admin.initializeApp();
const firestore = admin.firestore();
const storage = admin.storage();
const kmsClient = new KeyManagementServiceClient();

// KMS_KEY_NAME should point to the exact key version if you want versioned audit
const KMS_KEY_NAME = process.env.KMS_KEY_NAME || '';

export const generatePdfReport = onRequest(
  { region: 'us-central1' },
  async (req, res) => {
    try {
      const body = req.body ?? {};
      const inspectionId = String(body.inspectionId ?? 'demo');
      const title = String(body.title ?? 'Inspection Report');

      // Create PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]);
      const times = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      page.drawText(title, { x: 50, y: 780, size: 18, font: times, color: rgb(0, 0, 0) });
      page.drawText(`Inspection ID: ${inspectionId}`, { x: 50, y: 760, size: 12, font: times });

      const pdfBytes = await pdfDoc.save();

      // Compute SHA-256 hash
      const hash = crypto.createHash('sha256').update(pdfBytes).digest('hex');

      // Optionally sign with KMS (asymmetric)
      let signature: string | null = null;
      let keyVersion: string | null = null;

      if (KMS_KEY_NAME) {
        // store exactly what env var contained for audit
        keyVersion = KMS_KEY_NAME;

        const digest = crypto.createHash('sha256').update(pdfBytes).digest();
        const [signResp] = await kmsClient.asymmetricSign({
          name: KMS_KEY_NAME,
          digest: { sha256: digest },
        });

        const sigUint8 = signResp.signature as Uint8Array | Buffer;
        const sigBuf = Buffer.from(sigUint8);
        signature = sigBuf.toString('base64');
      }

      // Save PDF to default Storage bucket
      const bucket = storage.bucket();
      const filePath = `reports/${inspectionId}.pdf`;
      const file = bucket.file(filePath);
      await file.save(Buffer.from(pdfBytes), { contentType: 'application/pdf' });

      // Save metadata to Firestore (include keyVersion for audit)
      const docRef = await firestore.collection('documents').add({
        inspectionId,
        filePath,
        hash,
        signature,
        keyVersion,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).json({ inspectionId, filePath, hash, signature, keyVersion, documentId: docRef.id });
    } catch (err) {
      logger.error('generatePdfReport failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: msg });
    }
  }
);
export * from './verifySignature';
