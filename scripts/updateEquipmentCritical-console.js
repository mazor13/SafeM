/**
 * Run this in Firebase Console (Browser DevTools)
 * 1. Go to: https://console.firebase.google.com/project/ozen-staging-2025/firestore
 * 2. Open DevTools (F12)
 * 3. Paste this script in Console tab
 */

const CRITICAL_TYPES = ['laser', 'chemical', 'radiation', 'lifting', 'lifting_accessories', 'forklift'];

async function updateEquipment() {
  const clientsRef = firebase.firestore().collection('clients');
  const clientsSnap = await clientsRef.get();
  
  let updated = 0;
  
  for (const clientDoc of clientsSnap.docs) {
    const equipRef = clientDoc.ref.collection('equipment');
    const equipSnap = await equipRef.get();
    
    for (const equipDoc of equipSnap.docs) {
      const data = equipDoc.data();
      const isCritical = CRITICAL_TYPES.includes(data.type);
      
      if (data.isCritical !== isCritical || !data.approvalStatus) {
        await equipDoc.ref.update({
          isCritical: isCritical,
          approvalStatus: data.approvalStatus || 'approved'
        });
        console.log(`Updated: ${data.name} (${data.type}) → ${isCritical ? '🔴 Critical' : '🟢 Regular'}`);
        updated++;
      }
    }
  }
  
  console.log(`\n✅ Done! Updated ${updated} items`);
}

updateEquipment();
