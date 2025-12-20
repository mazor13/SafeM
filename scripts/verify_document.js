#!/usr/bin/env node
const { KeyManagementServiceClient } = require('@google-cloud/kms');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const crypto = require('crypto');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('docId', { type: 'string', demandOption: true })
  .option('project', { type: 'string', demandOption: true })
  .argv;

async function main() {
  const project = argv.project;
  const docId = argv.docId;

  // Initialize firebase-admin
  if (admin.apps.length === 0) {
    admin.initializeApp({ projectId: project });
  }
  
  const firestore = admin.firestore();
  const storage = admin.storage().bucket();
  const kms = new KeyManagementServiceClient();

  console.log(`Fetching document ${docId} from Firestore...`);
  const docSnap = await firestore.collection('documents').doc(docId).get();
  if (!docSnap.exists) {
    console.error('Document not found');
    process.exit(2);
  }
  const data = docSnap.data();
  const { filePath, signature, keyVersion } = data;
  if (!filePath || !signature || !keyVersion) {
    console.error('Document missing required fields (filePath, signature, keyVersion)');
    process.exit(2);
  }

  console.log(`Downloading file ${filePath} from default bucket...`);
  const [buf] = await storage.file(filePath).download();

  console.log(`Fetching public key from KMS: ${keyVersion}`);
  const [pubResp] = await kms.getPublicKey({ name: keyVersion });
  const publicKeyPem = pubResp.pem;

  console.log('Verifying signature...');
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(buf);
  verifier.end();
  const ok = verifier.verify(publicKeyPem, Buffer.from(signature, 'base64'));

  if (ok) {
    console.log('Signature is VALID ✅');
    process.exit(0);
  } else {
    console.log('Signature is INVALID ❌');
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(2);
});
