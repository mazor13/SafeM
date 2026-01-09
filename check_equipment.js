const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function check() {
  const snap = await db.collection('equipment').orderBy('createdAt', 'desc').limit(10).get();
  console.log(`Found ${snap.size} equipment items:\n`);
  snap.docs.forEach(doc => {
    const d = doc.data();
    console.log(`- ${d.name} | ${d.serialNumber} | ${d.createdBy}`);
  });
}

check().then(() => process.exit(0));
