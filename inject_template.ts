import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from './frontend/src/firebase';

const inject = async () => {
  try {
    await addDoc(collection(firestore, 'inspection_templates'), {
      title: "בדיקת בטיחות אש רגולטורית 2025",
      description: "תבנית מקצועית הכוללת בדיקת מטפים, יציאות חירום וחתימה דיגיטלית",
      category: "safety",
      isGlobal: true,
      sections: [
        {
          id: "sec1",
          title: "ציוד כיבוי אש",
          items: [
            { id: "it1", text: "האם המטפים בלחץ תקין?", type: "pass_fail", required: true },
            { id: "it2", text: "צילום המטף לבדיקה", type: "photo", required: true }
          ]
        },
        {
          id: "sec2",
          title: "דרכי מילוט",
          items: [
            { id: "it3", text: "האם יציאות החירום פנויות?", type: "pass_fail", required: true },
            { id: "it4", text: "חתימת בודק מוסמך", type: "signature_manual", required: true }
          ]
        }
      ],
      createdAt: serverTimestamp()
    });
    console.log("Template injected successfully!");
  } catch (e) { console.error(e); }
};
// הפקודה הזו היא רק להמחשה, אנחנו נשתמש בדרך פשוטה יותר דרך ה-UI
