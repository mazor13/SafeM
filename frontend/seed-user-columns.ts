import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// הגדרת העמודות עבור דף ניהול משתמשים
const userColumns = [
  { header: 'שם משתמש', accessor: 'name', type: 'text', visible: true, order: 1 },
  { header: 'אימייל', accessor: 'email', type: 'text', visible: true, order: 2 },
  { header: 'תפקיד', accessor: 'role', type: 'text', visible: true, order: 3 },
  { header: 'סטטוס ציות', accessor: 'compliance', type: 'status', visible: true, order: 4 },
  { header: 'גרסת חתימה', accessor: 'version', type: 'text', visible: true, order: 5 },
  { header: 'תאריך אישור', accessor: 'date', type: 'text', visible: true, order: 6 }
];

// הערה: כאן יש להשתמש ב-Firebase Config שלך
// אך מכיוון שאנו ב-Cloud Shell, נשתמש בגישה פשוטה יותר דרך ה-UI או פשוט נעדכן את ה-Component
