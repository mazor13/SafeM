#!/bin/bash

echo "🕵️ Smart Search for Header file..."

# 1. חיפוש כללי בכל הפרויקט אחר קובץ TSX שמכיל את המילה "Bell"
# הפקודה grep -l -r מחזירה רק את שמות הקבצים
HEADER_FILE=$(grep -l -r "Bell" frontend/src | grep ".tsx" | head -n 1)

if [ -z "$HEADER_FILE" ]; then
  echo "❌ Error: Could not find any file using the 'Bell' icon."
  exit 1
fi

echo "✅ Found Header file at: $HEADER_FILE"

# 2. גיבוי הקובץ לפני עריכה
cp "$HEADER_FILE" "$HEADER_FILE.bak"

# 3. הוספת ה-Import של HelpCircle (אם חסר)
if ! grep -q "HelpCircle" "$HEADER_FILE"; then
  # מחליף את הייבוא הקיים ומוסיף לו את HelpCircle
  sed -i 's/import {/import { HelpCircle,/' "$HEADER_FILE"
fi

# 4. הוספת useNavigate (אם חסר)
if ! grep -q "useNavigate" "$HEADER_FILE"; then
   # מוסיף import למעלה
   sed -i '1s/^/import { useNavigate } from "react-router-dom";\n/' "$HEADER_FILE"
   
   # מוסיף את הגדרת ה-hook בתוך הקומפוננטה
   # מניח שזו פונקציה Export default
   sed -i '/export default function/a \  const navigate = useNavigate();' "$HEADER_FILE"
fi

# 5. הזרקת הכפתור ליד הפעמון
if ! grep -q "navigate('/admin/help')" "$HEADER_FILE"; then
  echo "💉 Injecting Help Button..."
  
  # HTML של הכפתור החדש
  HELP_BTN='<button onClick={() => navigate("\/admin\/help")} className="p-2 text-slate-400 hover:text-white hover:bg-white\/10 rounded-full transition-colors mx-1" title="מרכז עזרה"><HelpCircle size={20} \/><\/button>'
  
  # החלפה: שים את כפתור העזרה לפני הפעמון
  sed -i "s/<Bell/$HELP_BTN <Bell/" "$HEADER_FILE"
  
  echo "✅ Button injected successfully."
else
  echo "⚠️ Button already exists in Header."
fi

echo "🚀 Deploying..."
cd frontend && npm run build
cd ..
firebase deploy --only hosting
