const admin = require('firebase-admin');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('docId', { type: 'string', demandOption: true })
  .option('project', { type: 'string', demandOption: true })
  .option('bucketName', { type: 'string', demandOption: true })
  .help().parse();

const { docId, project: projectId, bucketName } = argv;

// Initialize Firebase using Application Default Credentials (ADC)
try {
  admin.initializeApp({
    projectId: projectId,
    storageBucket: bucketName
  });
} catch (e) {
  console.error('❌ Auth Init Failed:', e.message);
  process.exit(1);
}

const db = admin.firestore();
const COLLECTION_NAME = 'documents';

async function main() {
  console.log(`🔎 Verifying document [${docId}] in collection [${COLLECTION_NAME}]...`);
  
  const doc = await db.collection(COLLECTION_NAME).doc(docId).get();
  
  if (!doc.exists) {
    throw new Error(`❌ Document not found: ${docId}`);
  }
  
  const data = doc.data();
  
  if (!data.signature || !data.keyVersion) {
     console.warn('⚠️ Warning: Document exists but missing signature/keyVersion metadata.');
  } else {
     console.log('✅ Document verified successfully (Signature present).');
  }
}

main().catch(err => { 
  console.error('❌ Verification failed:', err.message); 
  process.exit(1); 
});
