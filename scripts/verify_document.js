const admin = require('firebase-admin');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('docId', { type: 'string', demandOption: true })
  .option('project', { type: 'string', demandOption: true })
  .option('bucketName', { type: 'string', demandOption: true })
  .help().parse();

const { docId, project: projectId, bucketName } = argv;

console.log('------------------------------------------------');
// שלב 1: חשיפת הזהות המלאה
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    const keyData = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    console.log(`🔑 KEY PROJECT ID: [ ${keyData.project_id} ]`);
    console.log(`📧 KEY EMAIL ADDR: [ ${keyData.client_email} ]`); // <--- זה הנתון החסר שלנו!
  } catch (e) {
    console.log('⚠️ Could not read key file.');
  }
}

try {
  admin.initializeApp({ projectId, storageBucket: bucketName });
} catch (e) {
  process.exit(1);
}

const db = admin.firestore();

async function main() {
  console.log('🔦 DEBUG: Listing ALL Collections visible to this user:');
  const collections = await db.listCollections();
  
  if (collections.length === 0) {
    console.log('⚠️ NO COLLECTIONS FOUND. This user has no read permissions (or DB is empty).');
  } else {
    collections.forEach(col => {
      console.log(`   📂 Found Collection: [${col.id}]`);
    });
  }

  console.log('------------------------------------------------');
  console.log(`🕵️‍♂️ Searching for Doc ID: [${docId}]`);
  const doc = await db.collection('signedDocs').doc(docId).get();
  
  if (!doc.exists) throw new Error(`❌ Doc [${docId}] NOT FOUND.`);
  
  console.log('✅ Document Found! Success.');
}

main().catch(err => { console.error(err); process.exit(1); });
