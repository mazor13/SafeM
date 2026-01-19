const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json'); // וודא שהקובץ קיים בנתיב זה

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const entityType = 'user';

const columns = [
  { id: 'name', header: 'שם משתמש', accessor: 'name', type: 'text', visible: true, order: 1 },
  { id: 'email', header: 'אימייל', accessor: 'email', type: 'text', visible: true, order: 2 },
  { id: 'role', header: 'תפקיד', accessor: 'role', type: 'text', visible: true, order: 3 },
  { id: 'compliance', header: 'סטטוס ציות', accessor: 'compliance', type: 'status', visible: true, order: 4 },
  { id: 'version', header: 'גרסה', accessor: 'version', type: 'text', visible: true, order: 5 },
  { id: 'date', header: 'תאריך אישור', accessor: 'date', type: 'text', visible: true, order: 6 }
];

async function seed() {
  const colRef = db.collection('columnDefinitions').doc(entityType);
  await colRef.set({ 
    columns,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  console.log('Columns for "user" seeded successfully!');
  process.exit();
}

seed();
