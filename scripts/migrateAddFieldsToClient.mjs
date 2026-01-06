import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf8')
);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function addFieldsToClients() {
  console.log('🔄 Adding missing fields to clients collection...\n');
  
  const clientsSnapshot = await db.collection('clients').get();
  
  for (const clientDoc of clientsSnapshot.docs) {
    const data = clientDoc.data();
    const clientId = clientDoc.id;
    
    console.log(`📄 Client: ${data.name} (${clientId})`);
    
    // בדוק אילו שדות חסרים
    const updates = {};
    
    if (!data.plan) updates.plan = 'professional';
    if (!data.healthScore) updates.healthScore = 100;
    if (!data.domain) updates.domain = data.name?.toLowerCase().replace(/\s+/g, '') || '';
    if (!data.activeModules) updates.activeModules = ['safety_basic', 'equipment', 'findings'];
    if (data.usersCount === undefined) updates.usersCount = 0;
    if (data.maxUsers === undefined) updates.maxUsers = 10;
    if (!data.status) updates.status = 'active';
    if (!data.createdAt) updates.createdAt = new Date();
    
    if (Object.keys(updates).length > 0) {
      await db.collection('clients').doc(clientId).update(updates);
      console.log(`   ✅ Added fields:`, Object.keys(updates).join(', '));
    } else {
      console.log(`   ℹ️  All fields exist`);
    }
  }
  
  console.log('\n✅ Done!');
}

addFieldsToClients().catch(console.error);
