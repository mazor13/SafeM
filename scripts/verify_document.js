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
// אתחול (ADC)
try {
  admin.initializeApp({ projectId, storageBucket: bucketName });
  console.log('🤖 Auth initialized (ADC).');
} catch (e) {
  process.exit(1);
}

const db = admin.firestore();

async function main() {
  // השינוי הגדול: השם האמיתי של הקולקשן אצלך
  const COLLECTION_NAME = 'documents'; 

  console.log(`🔎 Target Collection: ${COLLECTION_NAME}`);
  console.log(`🕵️‍♂️ Searching for Doc ID: [${docId}]`);
  
  const doc = await db.collection(COLLECTION_NAME).doc(docId).get();
  
  if (!doc.exists) {
    // בדיקה נוספת: אולי המסמך קיים אבל ה-ID ב-Secret לא נכון?
    console.log('❌ Doc NOT FOUND. Printing first 3 docs in collection to help you verify IDs:');
    const snap = await db.collection(COLLECTION_NAME).limit(3).get();
    snap.forEach(d => console.log(`   - Available ID: ${d.id}`));
    
    throw new Error(`❌ Doc [${docId}] does not exist in [${COLLECTION_NAME}]. Update your Secret!`);
  }
  
  const data = doc.data();
  console.log('✅ Document Found!');
  
  // וודא שיש חתימה
  if (data.signature) {
      console.log('✅ Signature field exists.');
  } else {
      console.warn('⚠️ Warning: Document exists but has no "signature" field.');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
