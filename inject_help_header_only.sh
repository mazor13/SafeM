#!/bin/bash

echo "🚀 Injecting Help Center button into Header (Clean install)..."

# 1. איתור קובץ ה-Header באופן אוטומטי
# מחפש את הקובץ שמכיל את האייקון "Bell"
HEADER_FILE=$(grep -r "Bell" frontend/src/components/layout | grep ".tsx" | cut -d: -f1 | head -n 1)

if [ -z "$HEADER_FILE" ]; then
  echo "❌ Error: Could not find Header file."
  exit 1
fi

echo "✅ Found Header at: $HEADER_FILE"

# 2. גיבוי הקובץ
cp "$HEADER_FILE" "$HEADER_FILE.bak"

# 3. הוספת ה-Import לאייקון
if ! grep -q "HelpCircle" "$HEADER_FILE"; then
  # מוסיף את HelpCircle לרשימת האייקונים המיובאים
  sed -i 's/import {/import { HelpCircle,/' "$HEADER_FILE"
fi

# 4. הוספת ה-Hook לניווט (כדי שהכפתור יעבוד)
if ! grep -q "useNavigate" "$HEADER_FILE"; then
   # מוסיף את שורת ה-Import למעלה
   sed -i '1s/^/import { useNavigate } from "react-router-dom";\n/' "$HEADER_FILE"
   
   # מוסיף את הגדרת המשתנה navigate בתוך הפונקציה
   # מחפש את תחילת הפונקציה ומוסיף אחריה
   sed -i '/export default function/a \  const navigate = useNavigate();' "$HEADER_FILE"
fi

# 5. הזרקת הכפתור ליד הפעמון
if ! grep -q "navigate('/admin/help')" "$HEADER_FILE"; then
  echo "Injecting button UI..."
  
  # הגדרת הכפתור (HTML/JSX)
  # שים לב: אנחנו שמים אותו *לפני* הפעמון (<Bell)
  HELP_BTN='<button onClick={() => navigate("\/admin\/help")} className="p-2 text-slate-400 hover:text-white hover:bg-white\/10 rounded-full transition-colors mx-1" title="מרכז עזרה"><HelpCircle size={20} \/><\/button>'
  
  # הפקודה שמחליפה את <Bell ב- <HelpBtn> <Bell
  sed -i "s/<Bell/$HELP_BTN <Bell/" "$HEADER_FILE"
  
  echo "✅ Button added successfully."
else
  echo "⚠️ Button already exists."
fi

echo "🚀 Deploying..."
cd frontend && npm run build
cd ..
firebase deploy --only hosting
