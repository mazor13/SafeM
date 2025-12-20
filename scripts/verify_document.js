const admin = require('firebase-admin');
const { KeyManagementServiceClient } = require('@google-cloud/kms');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// שימוש בתחביר המודרני של yargs (כמו שעשינו ברוטציה)
const argv = yargs(hideBin(process.argv))
  .option('docId', { type: 'string', demandOption: true })
  .option('project', { type: 'string', demandOption: true })
  .option('bucketName', { type: 'string', demandOption: true })
  .help()
  .parse();

const projectId = argv.project;
const bucketName = argv.bucketName;

console.log(`🔌 Initializing Firebase for project: ${projectId}`);
console.log(`🪣 Target Storage Bucket: ${bucketName}`);

// Initialize Firebase
if (process.env.SA_KEY) {
  // אם רץ ב-CI עם מפתח Service Account
  const serviceAccount = JSON.parse(Buffer.from(process.env.SA_KEY, 'base64').toString());
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: bucketName
  });
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  // אם רץ עם רובוט רוטציה שיש לו Credentials בקובץ
  admin.initializeApp({
    storageBucket: bucketName
  });
} else {
  // ריצה מקומית או ברירת מחדל
  admin.initializeApp({
    projectId: projectId,
    storageBucket: bucketName
  });
}

const db = admin.firestore();
const storage = admin.storage();
const kms = new KeyManagementServiceClient();

async function main() {
  const { docId } = argv;
  console.log(`🕵️‍♂️ Verifying Document ID: ${docId}`);

  // 1. Fetch Document from Firestore
  const docRef = db.collection('signedDocs').doc(docId);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new Error(`❌ Document ${docId} not found in Firestore.`);
  }
  
  const data = docSnap.data();
  console.log('✅ Document metadata loaded.');

  if (!data.gsPath || !data.signature) {
    throw new Error('❌ Document is missing gsPath or signature fields.');
  }

  // 2. Download File from Storage
  // Parsing logic: gs://bucket-name/path/to/file
  let filePath = '';
  if (data.gsPath.includes(bucketName)) {
      filePath = data.gsPath.split(`${bucketName}/`)[1];
  } else {
      // Fallback parsing just in case
      console.warn(`⚠️ Warning: gsPath ${data.gsPath} does not contain bucket name ${bucketName}. Trying generic parse.`);
      const parts = data.gsPath.split('/');
      filePath = parts.slice(3).join('/'); // gs://bucket/file...
  }
  
  if (!filePath) {
     throw new Error(`❌ Could not parse file path from gsPath: ${data.gsPath}`);
  }

  console.log(`📥 Downloading file: ${filePath}...`);
  const bucket = storage.bucket(); 
  const file = bucket.file(filePath);
  const [exists] = await file.exists();
  
  if (!exists) {
    throw new Error(`❌ File not found in Storage: ${filePath}`);
  }

  const [fileContent] = await file.download();
  console.log(`✅ File downloaded (${fileContent.length} bytes).`);

  // 3. Verify Signature using KMS
  const keyVersionName = data.keyVersion; 
  if (!keyVersionName) {
    throw new Error('❌ Document missing keyVersion field.');
  }

  console.log(`🔐 Fetching Public Key for version: ${keyVersionName}...`);
  const [pubKey] = await kms.getPublicKey({ name: keyVersionName });
  const pem = pubKey.pem;

  console.log('🔏 Verifying signature...');
  const crypto = require('crypto');
  const verify = crypto.createVerify('SHA256');
  verify.update(fileContent);
  verify.end();

  const signatureBuffer = Buffer.from(data.signature, 'base64');
  const isValid = verify.verify(pem, signatureBuffer);

  if (isValid) {
    console.log('✅ SUCCESS: Signature is VALID!');
  } else {
    throw new Error('❌ FAILURE: Signature is INVALID.');
  }
}

main().catch(err => {
  console.error('🚨 Verification failed:', err);
  process.exit(1);
});
