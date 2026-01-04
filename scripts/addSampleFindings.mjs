import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

initializeApp({ projectId: 'ozen-staging-2025' });
const db = getFirestore();

const sampleFindings = [
  {
    title: 'תווית אזהרה חסרה על מכשיר לייזר',
    description: 'נמצא כי מכשיר הלייזר במעבדה 3 חסר תווית אזהרה בהתאם לתקן.',
    severity: 'high',
    status: 'open',
    equipmentId: 'laser-001',
    equipmentName: 'לייזר מעבדה',
    location: 'מעבדה 3',
    foundDate: Timestamp.fromDate(new Date('2025-12-20')),
    dueDate: Timestamp.fromDate(new Date('2026-01-15')),
    foundBy: 'consultant-uid',
    foundByName: 'מיכאל היועץ',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    title: 'מטף כיבוי אש פג תוקף',
    description: 'מטף כיבוי אש באזור הייצור פג תוקף ודורש החלפה.',
    severity: 'critical',
    status: 'open',
    location: 'אזור ייצור - קומה 1',
    foundDate: Timestamp.fromDate(new Date('2025-12-28')),
    dueDate: Timestamp.fromDate(new Date('2026-01-05')),
    foundBy: 'consultant-uid',
    foundByName: 'מיכאל היועץ',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    title: 'שלט יציאת חירום לא מואר',
    description: 'שלט יציאת חירום בקומה 2 אינו מואר - יש לבדוק חיבור חשמלי.',
    severity: 'medium',
    status: 'in_progress',
    location: 'קומה 2 - מסדרון מזרחי',
    foundDate: Timestamp.fromDate(new Date('2025-12-15')),
    dueDate: Timestamp.fromDate(new Date('2026-01-10')),
    foundBy: 'consultant-uid',
    foundByName: 'מיכאל היועץ',
    treatment: {
      description: 'הוזמן חשמלאי לבדיקה',
      treatedBy: 'client-uid',
      treatedByName: 'משה לוי',
      treatedDate: Timestamp.fromDate(new Date('2025-12-25')),
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    title: 'חוסר בציוד מגן אישי',
    description: 'לא נמצאו משקפי מגן מספיקים באזור העבודה עם חומרים כימיים.',
    severity: 'high',
    status: 'pending_approval',
    location: 'מחסן כימיקלים',
    foundDate: Timestamp.fromDate(new Date('2025-12-10')),
    dueDate: Timestamp.fromDate(new Date('2025-12-30')),
    foundBy: 'consultant-uid',
    foundByName: 'מיכאל היועץ',
    treatment: {
      description: 'הוזמנו 20 זוגות משקפי מגן חדשים והותקנו בעמדה ייעודית',
      treatedBy: 'client-uid',
      treatedByName: 'משה לוי',
      treatedDate: Timestamp.fromDate(new Date('2025-12-28')),
      images: [],
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    title: 'ריצוף פגום בכניסה למפעל',
    description: 'נמצאה אריח שבורה בכניסה הראשית - סכנת מעידה.',
    severity: 'low',
    status: 'closed',
    location: 'כניסה ראשית',
    foundDate: Timestamp.fromDate(new Date('2025-11-20')),
    closedDate: Timestamp.fromDate(new Date('2025-12-01')),
    foundBy: 'consultant-uid',
    foundByName: 'מיכאל היועץ',
    treatment: {
      description: 'האריח הוחלפה על ידי קבלן',
      treatedBy: 'client-uid',
      treatedByName: 'משה לוי',
      treatedDate: Timestamp.fromDate(new Date('2025-11-28')),
    },
    approval: {
      status: 'approved',
      by: 'consultant-uid',
      byName: 'מיכאל היועץ',
      date: Timestamp.fromDate(new Date('2025-12-01')),
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

async function addFindings() {
  console.log('🔄 Adding sample findings...\n');
  
  const clientId = 'ddJPeZeFSRw7ILjeBhrA';
  const findingsRef = db.collection('clients').doc(clientId).collection('findings');
  
  for (const finding of sampleFindings) {
    const docRef = await findingsRef.add(finding);
    console.log(`✅ Added: ${finding.title} (${finding.severity}) - ${docRef.id}`);
  }
  
  console.log(`\n✅ Done! Added ${sampleFindings.length} findings`);
  process.exit(0);
}

addFindings().catch(console.error);
