import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import admin from 'firebase-admin';
import { KeyManagementServiceClient } from '@google-cloud/kms';
import { Storage } from '@google-cloud/storage';
import crypto from 'crypto';

// Initialize only if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const firestore = admin.firestore();
const kms = new KeyManagementServiceClient();

// Controls access: either verify Firebase Auth custom claim "role: super_admin"
// or accept a pre-shared VERIFY_TOKEN in header "x-verify-token" (set via CI/Secrets).
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || '';

export const verifySignatureEndpoint = onRequest({ region: 'us-central1' }, async (req, res) => {
  try {
    // Authorization: either VERIFY_TOKEN or Firebase ID token with claim role: super_admin
    const headerToken = (req.get && req.get('x-verify-token')) || (req.headers && req.headers['x-verify-token']);
    if (VERIFY_TOKEN && headerToken && headerToken === VERIFY_TOKEN) {
      // authorized via token
    } else {
      // try verifying Firebase ID token and custom claim
      const authHeader = req.get && req.get('Authorization');
      if (!authHeader) {
        res.status(401).json({ error: 'missing authorization' });
        return;
      }
      const idToken = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
      try {
        const decoded = await admin.auth().verifyIdToken(idToken);
        if (decoded.role !== 'super_admin' && decoded.role !== 'admin') {
          res.status(403).json({ error: 'forbidden: insufficient role' });
          return;
        }
      } catch (err) {
        res.status(401).json({ error: 'invalid token' });
        return;
      }
    }

    // Input: expect either ?docId=... or JSON body { documentId } or { filePath, signature, keyVersion }
    const docId = (req.query && req.query.docId) || (req.body && req.body.documentId) || (req.body && req.body.docId);
    let filePath = req.body && req.body.filePath;
    let signatureBase64 = req.body && req.body.signature;
    let keyVersionName = req.body && req.body.keyVersion;

    if (!docId && !(filePath && signatureBase64 && keyVersionName)) {
      res.status(400).json({ error: 'missing parameters: provide docId OR (filePath, signature, keyVersion)' });
      return;
    }

    // If docId provided, fetch metadata from Firestore
    if (docId) {
      const docSnap = await firestore.collection('documents').doc(String(docId)).get();
      if (!docSnap.exists) {
        res.status(404).json({ error: 'document not found' });
        return;
      }
      const data = docSnap.data() as any;
      filePath = data.filePath;
      signatureBase64 = data.signature;
      keyVersionName = data.keyVersion;
      if (!filePath || !signatureBase64 || !keyVersionName) {
        res.status(400).json({ error: 'document missing signature or keyVersion metadata' });
        return;
      }
    }

    // Download file bytes from default bucket
    const bucket = admin.storage().bucket(); 
    const [fileBuffer] = await bucket.file(filePath).download();

    // Get public key from KMS
    const [pubResp] = await kms.getPublicKey({ name: keyVersionName });
    const publicKeyPem = pubResp.pem;
    if (!publicKeyPem) {
      res.status(500).json({ error: 'failed to retrieve public key from KMS' });
      return;
    }

    // Verify signature (RSA-SHA256)
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(fileBuffer);
    verifier.end();
    const sigBuf = Buffer.from(signatureBase64, 'base64');
    const verified = verifier.verify(publicKeyPem as string, sigBuf);

    // Return result
    res.json({
      ok: verified,
      filePath,
      keyVersion: keyVersionName,
      documentId: docId || null
    });
  } catch (err) {
    logger.error('verifySignatureEndpoint error', err);
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});
