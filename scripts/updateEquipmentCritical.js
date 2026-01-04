/**
 * Script to update existing equipment with isCritical field
 * Run with: node scripts/updateEquipmentCritical.js
 */

const admin = require('firebase-admin');

// Critical equipment types
const CRITICAL_EQUIPMENT_TYPES = [
  'laser',
  'chemical', 
  'radiation',
  'lifting',
  'lifting_accessories',
  'forklift',
];

// Initialize Firebase Admin
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function updateEquipment() {
  console.log('🔄 Starting equipment update...\n');
  
  let totalUpdated = 0;
  let totalCritical = 0;
  let totalNonCritical = 0;
  
  try {
    // Get all clients
    const clientsSnapshot = await db.collection('clients').get();
    console.log(`📁 Found ${clientsSnapshot.size} clients\n`);
    
    for (const clientDoc of clientsSnapshot.docs) {
      const clientId = clientDoc.id;
      const clientName = clientDoc.data().name || clientId;
      
      // Get equipment for this client
      const equipmentSnapshot = await db
        .collection('clients')
        .doc(clientId)
        .collection('equipment')
        .get();
      
      if (equipmentSnapshot.empty) {
        console.log(`  📦 ${clientName}: No equipment`);
        continue;
      }
      
      console.log(`  📦 ${clientName}: ${equipmentSnapshot.size} equipment items`);
      
      for (const equipDoc of equipmentSnapshot.docs) {
        const equipData = equipDoc.data();
        const isCritical = CRITICAL_EQUIPMENT_TYPES.includes(equipData.type);
        
        // Update only if fields are missing or different
        const updates = {};
        
        if (equipData.isCritical !== isCritical) {
          updates.isCritical = isCritical;
        }
        
        if (!equipData.approvalStatus) {
          updates.approvalStatus = 'approved'; // Existing equipment is approved
        }
        
        if (Object.keys(updates).length > 0) {
          await equipDoc.ref.update(updates);
          totalUpdated++;
          
          if (isCritical) {
            totalCritical++;
            console.log(`     ✅ ${equipData.name} (${equipData.type}) → 🔴 Critical`);
          } else {
            totalNonCritical++;
            console.log(`     ✅ ${equipData.name} (${equipData.type}) → 🟢 Regular`);
          }
        }
      }
    }
    
    console.log('\n========================================');
    console.log('📊 Summary:');
    console.log(`   Total updated: ${totalUpdated}`);
    console.log(`   Critical: ${totalCritical}`);
    console.log(`   Non-critical: ${totalNonCritical}`);
    console.log('========================================\n');
    console.log('✅ Done!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  process.exit(0);
}

updateEquipment();
