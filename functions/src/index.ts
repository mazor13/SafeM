import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as crypto from 'crypto';
import { KeyManagementServiceClient } from '@google-cloud/kms';

admin.initializeApp();

const kmsKeyName = process.env.KMS_KEY_NAME || '';
const kmsClient = new KeyManagementServiceClient();

// PoC: generate a simple PDF report, compute SHA-256 hash, optionally sign with Cloud KMS, and return metadata.
export const generatePdfReport = functions.https.onRequest(async (req, res) => {
  try {
    const { inspectionId = 'demo', title = 'Inspection Report' } = req.body || {};

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontSize = 12;
    page.drawText(title, {
      x: 50,
      y: 780,
      size: 18,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    page.drawText(`Inspection ID: ${inspectionId}`, { x: 50, y: 760, size: fontSize, font: timesRomanFont });

    const pdfBytes = await pdfDoc.save();

    // compute sha256
    const hash = crypto.createHash('sha256').update(pdfBytes).digest('hex');

    let signature: string | null = null;

    if (kmsKeyName) {
      // Cloud KMS asymmetric signing expects a digest. We use SHA256
      const digest = crypto.createHash('sha256').update(pdfBytes).digest();

      // Call KMS to sign
      const [signResp] = await kmsClient.asymmetricSign({
        name: kmsKeyName,
        digest: {
          sha256: digest,
        },
      });

      const sigBuf = signResp.signature as Buffer;
      signature = sigBuf.toString('base64');
    }

    // Optionally save to Firebase Storage
    const bucket = admin.storage().bucket();
    const filePath = `reports/${inspectionId}.pdf`;
    const file = bucket.file(filePath);
    await file.save(Buffer.from(pdfBytes), { contentType: 'application/pdf' });

    // Save metadata to Firestore
    const docRef = await admin.firestore().collection('documents').add({
      inspectionId,
      filePath,
      hash,
      signature,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Return metadata
    res.json({ inspectionId, filePath, hash, signature, documentId: docRef.id });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: (err as Error).message });
  }
});
