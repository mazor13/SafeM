// ===========================================
// AEGIS - Seed Laser Safety Template to Firestore
// ===========================================

import { doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { firestore as db } from '../../firebase';
import { laserSafetyQuarterlyTemplate } from './laserSafetyQuarterlyTemplate';

/**
 * Seed the Laser Safety Quarterly template to Firestore
 */
export async function seedLaserSafetyTemplate(): Promise<string> {
  const templateId = 'template_laser_safety_quarterly_v1';
  
  try {
    const templateData = {
      ...laserSafetyQuarterlyTemplate,
      id: templateId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'templates', templateId), templateData);
    
    console.log('✅ Laser Safety Quarterly template seeded successfully!');
    console.log(`   Template ID: ${templateId}`);
    
    return templateId;
  } catch (error) {
    console.error('❌ Error seeding template:', error);
    throw error;
  }
}

/**
 * Call this function to seed all system templates
 */
export async function seedAllSystemTemplates(): Promise<void> {
  console.log('🌱 Seeding system templates...');
  
  await seedLaserSafetyTemplate();
  
  // Add more templates here as needed:
  // await seedFireSafetyTemplate();
  // await seedElectricalSafetyTemplate();
  
  console.log('✅ All system templates seeded!');
}

export default seedLaserSafetyTemplate;