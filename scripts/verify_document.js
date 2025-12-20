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
console.log(`🔌 Init Firebase: Project=${projectId}`);

try {
  // המהפכה: אין כאן credentials. הספריה מוצאת את המשתנה GOOGLE_APPLICATION_CREDENTIALS לבד.
  admin.initializeApp({
    storageBucket: bucketName,
    projectId: projectId
  });
  console.log('🤖 Auth initialized via Standard Environment Variables (ADC).');
} catch (e) {
  console.error('❌ Auth Init Failed:', e.message);
  process.exit(1);
}

const db = admin.firestore();

async function main() {
  console.log('🔦 DEBUG: Checking connectivity...');
  try {
    const snapshot = await db.collection('signedDocs').limit(1).get();
    console.log(`✅ Connection successful. Collection empty? ${snapshot.empty}`);
  } catch (err) {
    console.error('❌ Firestore Access Denied:', err.message);
    process.exit(1);
  }

  console.log(`🕵️‍♂️ Searching for Doc ID: [${docId}]`);
  const doc = await db.collection('signedDocs').doc(docId).get();
  
  if (!doc.exists) {
    throw new Error(`❌ Doc [${docId}] NOT FOUND.`);
  }
  
  console.log('✅ Document Found! Success.');
}

main().catch(err => { console.error(err); process.exit(1); });
