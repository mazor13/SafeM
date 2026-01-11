const admin = require('firebase-admin');

// Initialize with default credentials (Cloud Shell is already authenticated)
admin.initializeApp({
  projectId: 'ozen-staging-2025'
});

const db = admin.firestore();

async function createNotification() {
  try {
    const notificationRef = await db.collection('notifications').add({
      userId: 'REpPeTXJGSfCFmXmYOvabnphZY03',
      tenantId: 'test-tenant',
      title: '🎉 התראה ראשונה!',
      body: 'ברוך הבא למערכת ההתראות החדשה של SafeM',
      type: 'system',
      isRead: false,
      readAt: null,
      linkTo: null,
      linkType: null,
      linkId: null,
      sourceRuleId: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('✅ Notification created successfully!');
    console.log('📋 ID:', notificationRef.id);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createNotification();
