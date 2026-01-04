import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Critical equipment types
const CRITICAL_TYPES = ['laser', 'chemical', 'radiation', 'lifting', 'lifting_accessories', 'forklift'];

// Initialize with application default credentials
initializeApp({
  projectId: 'ozen-staging-2025'
});

const db = getFirestore();

async function updateEquipment() {
  console.log('🔄 Starting equipment update...\n');
  
  let updated = 0;
  
  const clientsSnap = await db.collection('clients').get();
  console.log(`📁 Found ${clientsSnap.size} clients\n`);
  
  for (const clientDoc of clientsSnap.docs) {
    const clientName = clientDoc.data().name || clientDoc.id;
    const equipSnap = await clientDoc.ref.collection('equipment').get();
    
    console.log(`  📦 ${clientName}: ${equipSnap.size} items`);
    
    for (const equipDoc of equipSnap.docs) {
      const data = equipDoc.data();
      const isCritical = CRITICAL_TYPES.includes(data.type);
      
      if (data.isCritical !== isCritical || !data.approvalStatus) {
        await equipDoc.ref.update({
          isCritical: isCritical,
          approvalStatus: data.approvalStatus || 'approved'
        });
        console.log(`     ✅ ${data.name} → ${isCritical ? '🔴 Critical' : '🟢 Regular'}`);
        updated++;
      }
    }
  }
  
  console.log(`\n✅ Done! Updated ${updated} items`);
  process.exit(0);
}

updateEquipment().catch(console.error);
