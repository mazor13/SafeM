#!/bin/bash

echo "🚑 Fixing Imports in GlobalSearch.tsx..."

TARGET_FILE="frontend/src/components/search/GlobalSearch.tsx"

# 1. שחזור מהגיבוי (כדי למחוק את כל השורות השגויות)
if [ -f "$TARGET_FILE.bak" ]; then
    cp "$TARGET_FILE.bak" "$TARGET_FILE"
    echo "✅ Restored clean file from backup."
else
    echo "❌ Backup file not found! Attempting to fix manually..."
    # במקרה חירום שאין גיבוי, נמחק ידנית את התוספות השגויות (לא אמור לקרות)
fi

# 2. הוספת HelpCircle בצורה כירורגית (רק לשורה של lucide-react)
# הסבר: הפקודה מחפשת שורה שמכילה 'from 'lucide-react' ורק בה מחליפה
sed -i "/from 'lucide-react'/s/import {/import { HelpCircle,/" "$TARGET_FILE"

# 3. הוספת useNavigate בצורה כירורגית
if grep -q "react-router-dom" "$TARGET_FILE"; then
    # אם כבר יש ייבוא מ-router, נוסיף לו את useNavigate
    sed -i "/from 'react-router-dom'/s/import {/import { useNavigate,/" "$TARGET_FILE"
else
    # אם אין, נוסיף שורה חדשה למעלה
    sed -i '1s/^/import { useNavigate } from "react-router-dom";\n/' "$TARGET_FILE"
fi

# 4. הוספת ה-Hook בתוך הפונקציה
# מוסיף את const navigate רק אם הוא לא קיים
if ! grep -q "const navigate =" "$TARGET_FILE"; then
    sed -i '/export default function/a \  const navigate = useNavigate();' "$TARGET_FILE" || sed -i '/const .* =.*=>/a \  const navigate = useNavigate();' "$TARGET_FILE"
fi

# 5. הזרקת הכפתור (שוב, כי השחזור מחק אותו)
if ! grep -q "navigate('/admin/help')" "$TARGET_FILE"; then
  echo "💉 Re-injecting Button..."
  HELP_BTN='<button onClick={() => navigate("\/admin\/help")} className="p-2 text-slate-400 hover:text-white hover:bg-white\/10 rounded-full transition-colors mx-1" title="מרכז עזרה"><HelpCircle size={20} \/><\/button>'
  sed -i "s/<Bell/$HELP_BTN <Bell/" "$TARGET_FILE"
fi

echo "✅ File fixed. Verification:"
grep "import" "$TARGET_FILE" | grep "HelpCircle"

echo "🚀 Deploying fixed version..."
cd frontend && npm run build
cd ..
firebase deploy --only hosting
