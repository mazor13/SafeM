const admin = require('firebase-admin');

// Initialize with default credentials
admin.initializeApp({
  projectId: 'ozen-staging-2025'
});

const db = admin.firestore();

async function createTestTask() {
  const testUserId = 'REpPeTXJGSfCFmXmYOvabnphZY03'; // mazortest13@gmail.com
  
  const task = {
    tenantId: testUserId,
    title: 'בדיקת מערכת המשימות',
    description: 'זוהי משימת טסט ראשונה למערכת הניהול החדשה',
    status: 'todo',
    priority: 'high',
    createdBy: testUserId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    commentsCount: 0,
    watchers: [testUserId],
  };
  
  const docRef = await db.collection('tasks').add(task);
  console.log('✅ Task created with ID:', docRef.id);
  
  // Create another task
  const task2 = {
    tenantId: testUserId,
    title: 'תיקון ממצא בטיחות דחוף',
    description: 'נדרש תיקון מיידי של ציוד כיבוי אש בקומה 3',
    status: 'in_progress',
    priority: 'urgent',
    createdBy: testUserId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    commentsCount: 0,
    watchers: [testUserId],
  };
  
  const docRef2 = await db.collection('tasks').add(task2);
  console.log('✅ Task created with ID:', docRef2.id);
  
  // Create a completed task
  const task3 = {
    tenantId: testUserId,
    title: 'השלמת דוח ביקורת חודשי',
    description: 'דוח ביקורת לחודש דצמבר 2024',
    status: 'done',
    priority: 'medium',
    createdBy: testUserId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    completedAt: admin.firestore.FieldValue.serverTimestamp(),
    commentsCount: 0,
    watchers: [testUserId],
  };
  
  const docRef3 = await db.collection('tasks').add(task3);
  console.log('✅ Task created with ID:', docRef3.id);
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ 3 test tasks created!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📍 View at: https://ozen-staging-2025.web.app/admin/tasks');
}

createTestTask()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
