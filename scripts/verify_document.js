const admin = require('firebase-admin');
const { KeyManagementServiceClient } = require('@google-cloud/kms');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('docId', { type: 'string', demandOption: true })
  .option('project', { type: 'string', demandOption: true })
  .option('bucketName', { type: 'string', demandOption: true })
  .help().parse();

const { docId, project: projectId, bucketName } = argv;
console.log(`🔌 Init Firebase: Project=${projectId}, Bucket=${bucketName}`);

if (process.env.SA_KEY) {
  const sa = JSON.parse(Buffer.from(process.env.SA_KEY, 'base64').toString());
  admin.initializeApp({ credential: admin.credential.cert(sa), storageBucket: bucketName });
} else {
  admin.initializeApp({ projectId, storageBucket: bucketName });
}

const db = admin.firestore();
const storage = admin.storage();
const kms = new KeyManagementServiceClient();

async function main() {
  console.log(`Checking Doc: ${docId}`);
  const doc = await db.collection('signedDocs').doc(docId).get();
  if (!doc.exists) throw new Error('Doc missing');
  const data = doc.data();
  
  let filePath = data.gsPath;
  if (filePath.startsWith('gs://')) filePath = filePath.split('/').slice(3).join('/');
  
  console.log(`Downloading: ${filePath}`);
  const [content] = await storage.bucket().file(filePath).download();
  
  console.log(`Verifying with: ${data.keyVersion}`);
  const [pub] = await kms.getPublicKey({ name: data.keyVersion });
  
  const verify = require('crypto').createVerify('SHA256');
  verify.update(content);
  if (!verify.verify(pub.pem, Buffer.from(data.signature, 'base64'))) throw new Error('Invalid Signature');
  console.log('✅ Valid Signature');
}
main().catch(err => { console.error(err); process.exit(1); });
