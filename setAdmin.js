const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = 'REpPeTXJGSfCFmXmYOvabnphZY03';

async function setClaims() {
  try {
    console.log('Setting claims for user:', uid);
    // נתינת הרשאות מנהל-על
    await admin.auth().setCustomUserClaims(uid, {
      role: 'super_admin',
      organizationId: 'mazor_safety_hq'
    });
    console.log('✅ Success! User is now a Super Admin.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setClaims();
