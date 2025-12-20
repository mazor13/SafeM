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
console.log(`🔌 Init Firebase: Project=${projectId}`);

if (process.env.SA_KEY) {
  const sa = JSON.parse(Buffer.from(process.env.SA_KEY, 'base64').toString());
  admin.initializeApp({ credential: admin.credential.cert(sa), storageBucket: bucketName });
} else {
  admin.initializeApp({ projectId, storageBucket: bucketName });
}

const db = admin.firestore();

async function main() {
  // DEBUG SECTION: List actual documents
  console.log('🔦 DEBUG: Listing documents in "signedDocs" collection:');
  const snapshot = await db.collection('signedDocs').limit(5).get();
  if (snapshot.empty) {
    console.log('⚠️ Collection "signedDocs" is EMPTY or Permission Denied!');
  } else {
    snapshot.forEach(doc => {
      console.log(`   Found Doc ID: [${doc.id}]`); // Brackets show hidden spaces
    });
  }

  console.log('------------------------------------------------');
  console.log(`🕵️‍♂️ Looking for specific Doc ID: [${docId}]`); // Brackets show hidden spaces

  const doc = await db.collection('signedDocs').doc(docId).get();
  
  if (!doc.exists) {
    throw new Error(`❌ Doc [${docId}] NOT FOUND. See list above for valid IDs.`);
  }
  
  // אם מצא, ממשיך כרגיל (רק כדי לוודא שהכל תקין)
  console.log('✅ Document Found! Metadata loaded.');
  // ... שאר הקוד לא קריטי כרגע, אנחנו רק רוצים לפתור את ה-Doc Missing
}

main().catch(err => { console.error(err); process.exit(1); });
