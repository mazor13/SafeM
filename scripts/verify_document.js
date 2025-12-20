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
console.log(`🔌 Requested Target Project: ${projectId}`);

// --- בדיקת המפתח ---
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    const keyData = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    console.log(`🔑 ACTUAL KEY PROJECT ID:  [ ${keyData.project_id} ]`); // <--- זה יגלה את האמת
    
    if (keyData.project_id !== projectId) {
      console.error('🚨 MISMATCH DETECTED! The key belongs to the wrong project!');
    }
  } catch (e) {
    console.log('Could not read key file details.');
  }
}
// -------------------

try {
  admin.initializeApp({
    storageBucket: bucketName,
    projectId: projectId
  });
  console.log('🤖 Auth initialized.');
} catch (e) {
  console.error('❌ Auth Init Failed:', e.message);
  process.exit(1);
}

const db = admin.firestore();

async function main() {
  console.log('🔦 DEBUG: Checking connectivity...');
  const snapshot = await db.collection('signedDocs').limit(1).get();
  console.log(`✅ Connection successful. Collection empty? ${snapshot.empty}`);

  console.log(`🕵️‍♂️ Searching for Doc ID: [${docId}]`);
  const doc = await db.collection('signedDocs').doc(docId).get();
  
  if (!doc.exists) throw new Error(`❌ Doc [${docId}] NOT FOUND.`);
  
  console.log('✅ Document Found! Success.');
}

main().catch(err => { console.error(err); process.exit(1); });
