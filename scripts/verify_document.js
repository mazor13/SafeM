const admin = require('firebase-admin');
const { KeyManagementServiceClient } = require('@google-cloud/kms');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');

const argv = yargs(hideBin(process.argv))
  .option('docId', { type: 'string', demandOption: true })
  .option('project', { type: 'string', demandOption: true })
  .option('bucketName', { type: 'string', demandOption: true })
  .option('keyFile', { type: 'string', demandOption: true }) // פרמטר חובה חדש
  .help().parse();

const { docId, project: projectId, bucketName, keyFile } = argv;

console.log('------------------------------------------------');
console.log(`🔌 Init Firebase: Project=${projectId}`);

// אימות באמצעות הקובץ בלבד (הכי בטוח)
try {
  if (!fs.existsSync(keyFile)) {
     throw new Error(`Key file not found at: ${keyFile}`);
  }
  const serviceAccount = require(keyFile);
  console.log(`🤖 Using Key File: ${keyFile}`);
  console.log(`🤖 I AM LOGGED IN AS: [ ${serviceAccount.client_email} ]`);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: bucketName
  });
} catch (error) {
  console.error('❌ Authentication Failed:', error.message);
  process.exit(1);
}

const db = admin.firestore();

async function main() {
  console.log('🔦 DEBUG MODE: Listing documents in Firestore:');
  const snapshot = await db.collection('signedDocs').limit(5).get();
  
  if (snapshot.empty) {
    console.log('⚠️ Collection is EMPTY. This likely means Permissions are still missing for the email above.');
  } else {
    snapshot.forEach(doc => console.log(`   📄 Found ID: [${doc.id}]`));
  }

  console.log('------------------------------------------------');
  console.log(`🕵️‍♂️ Searching for: [${docId}]`);
  
  const doc = await db.collection('signedDocs').doc(docId).get();
  if (!doc.exists) throw new Error(`❌ Doc [${docId}] NOT FOUND.`);
  
  console.log('✅ Document Found! Success.');
}
main().catch(err => { console.error(err); process.exit(1); });
