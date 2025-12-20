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
  console.log('------------------------------------------------');
  console.log('🔦 DEBUG MODE: Listing documents in Firestore:');
  
  // ננסה לקרוא מסמכים כדי לראות מה באמת קיים שם
  try {
    const snapshot = await db.collection('signedDocs').limit(5).get();
    if (snapshot.empty) {
      console.log('⚠️ Collection "signedDocs" appears EMPTY.');
    } else {
      snapshot.forEach(doc => {
        // הסוגריים כאן יעזרו לנו לראות רווחים נסתרים
        console.log(`   📄 Found ID: [${doc.id}]`); 
      });
    }
  } catch (err) {
    console.error('⚠️ Error listing documents (Permission?):', err.message);
  }

  console.log('------------------------------------------------');
  console.log(`🕵️‍♂️ Searching for specific Doc ID from Secret: [${docId}]`);
  
  const doc = await db.collection('signedDocs').doc(docId).get();
  
  if (!doc.exists) {
    throw new Error(`❌ Doc [${docId}] NOT FOUND. Please compare with the list above.`);
  }
  
  console.log('✅ Document Found! ID matches.');
}

main().catch(err => { console.error(err); process.exit(1); });
