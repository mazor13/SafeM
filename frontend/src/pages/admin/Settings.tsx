import React from 'react';
import { useAuth } from '../../providers/AuthProvider'; // תיקון נתיב
// SystemSettings כבר לא צריך import אם אנחנו כותבים אותו כאן או אם הוא באותה תיקייה
// אבל לצורך הפשטות, מכיוון שזה קובץ קטן, נכתוב אותו כקומפוננטה אחת

import { 
  GlobeAltIcon, 
  UserGroupIcon, 
  CpuChipIcon
} from '@heroicons/react/24/outline';

// קומפוננטת הגדרות המערכת המלאה
const SystemSettings = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">הגדרות מערכת גלובליות</h2>
            <div className="bg-white p-6 rounded shadow border">
                <p>כאן יהיו הגדרות ה-AI, הצוותים והלוגים.</p>
            </div>
        </div>
    )
}

export default function Settings() {
  const { user } = useAuth();
  
  // אם זה סופר אדמין, הצג את הגדרות המערכת
  if (user?.role === 'super_admin') {
    return <SystemSettings />;
  }

  return <div>אין לך הרשאה לצפות בדף זה.</div>;
}
