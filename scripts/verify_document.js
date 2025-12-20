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

console.log('------------------------------------------------');
console.log(`🔌 Init Firebase: Project=${projectId}`);

// --- זיהוי הרובוט ---
let serviceAccountEmail = 'Unknown (ADC)';
if (process.env.SA_KEY) {
  try {
    const sa = JSON.parse(Buffer.from(process.env.SA_KEY, 'base64').toString());
    serviceAccountEmail = sa.client_email; // כאן הזהב! שולפים את האימייל מהמפתח
    console.log(`🤖 I AM LOGGED IN AS: [ ${serviceAccountEmail} ]`); 
    
    admin.initializeApp({
      credential: admin.credential.cert(sa),
      storageBucket: bucketName
    });
  } catch (e) {
    console.error('❌ Error parsing SA_KEY:', e.message);
  }
} else {
  console.log('🤖 I AM LOGGED IN AS: [ Default / Local ADC ]');
  admin.initializeApp({ projectId, storageBucket: bucketName });
}
// --------------------

const db = admin.firestore();

async function main() {
  console.log('🔦 DEBUG MODE: Listing documents in Firestore:');
  
  try {
    const snapshot = await db.collection('signedDocs').limit(5).get();
    
    if (snapshot.empty) {
      console.log('⚠️ Collection "signedDocs" appears EMPTY to this user.');
      console.log('👉 ACTION REQUIRED: Grant "Cloud Datastore User" role to:', serviceAccountEmail);
    } else {
      snapshot.forEach(doc => {
        console.log(`   📄 Found ID: [${doc.id}]`); 
      });
    }
  } catch (err) {
    console.error('❌ CRITICAL PERMISSION ERROR:', err.message);
  }

  console.log('------------------------------------------------');
  console.log(`🕵️‍♂️ Searching for specific Doc ID: [${docId}]`);
  
  const doc = await db.collection('signedDocs').doc(docId).get();
  
  if (!doc.exists) {
    throw new Error(`❌ Doc [${docId}] NOT FOUND.`);
  }
  
  console.log('✅ Document Found! Metadata loaded.');
}

main().catch(err => { console.error(err); process.exit(1); });
