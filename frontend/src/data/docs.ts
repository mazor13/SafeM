export interface DocArticle {
  id: string;
  title: string;
  category: 'general' | 'equipment' | 'inspections' | 'admin';
  content: string; // HTML content support
}

export const SYSTEM_DOCS: DocArticle[] = [
  {
    id: 'intro',
    title: 'ברוכים הבאים ל-AEGIS',
    category: 'general',
    content: `
      <p>מערכת AEGIS היא הפלטפורמה המתקדמת לניהול בטיחות וציוד.</p>
      <h3>מה אפשר לעשות כאן?</h3>
      <ul>
        <li>לנהל תיקי לקוחות ואתרים</li>
        <li>לעקוב אחר ציוד ובדיקות תקופתיות</li>
        <li>להפיק דוחות בטיחות ותסקירים</li>
      </ul>
    `
  },
  {
    id: 'equipment-form',
    title: 'מדריך הוספת ציוד',
    category: 'equipment',
    content: `
      <p>טופס הציוד בנוי בצורה היררכית כדי למנוע טעויות:</p>
      <ol>
        <li><strong>סיווג:</strong> שיוך ללקוח ותחום בטיחות.</li>
        <li><strong>זיהוי:</strong> הזנת פרטי יצרן ומיקום.</li>
        <li><strong>תקינה:</strong> הגדרת תדירות בדיקות.</li>
      </ol>
      <p>💡 <strong>טיפ:</strong> שדה המיקום לומד אוטומטית ממיקומים קודמים של הלקוח.</p>
    `
  },
  {
    id: 'sites-management',
    title: 'ניהול אתרים ומבנים',
    category: 'admin',
    content: `
      <p>כדי לשמור על סדר, אנו ממליצים לעבוד במבנה היררכי:</p>
      <ul>
        <li><strong>אתר (Site):</strong> הקמפוס או המתחם הראשי.</li>
        <li><strong>מבנה (Building):</strong> בניין בודד בתוך האתר.</li>
        <li><strong>אזור (Area):</strong> קומה או חדר ספציפי.</li>
      </ul>
      <p>יש להקים את האתרים לפני שיוך הציוד אליהם.</p>
    `
  }
];
