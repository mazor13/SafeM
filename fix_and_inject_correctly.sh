#!/bin/bash

echo "🚑 Starting Recovery & Surgical Injection..."

# 1. ביטול הנזק - שחזור הקובץ השגוי
# אנחנו בודקים אם קיים קובץ גיבוי ל-ContactsTab ומשחזרים אותו
if [ -f "frontend/src/components/admin/ContactsTab.tsx.bak" ]; then
    echo "🔄 Restoring ContactsTab.tsx from backup..."
    mv frontend/src/components/admin/ContactsTab.tsx.bak frontend/src/components/admin/ContactsTab.tsx
    echo "✅ ContactsTab restored (Build errors should be gone)."
else
    echo "⚠️ No backup found for ContactsTab. Please check manually if build fails."
fi

# 2. איתור ה-Header האמיתי (לפי "Ctrl+K")
echo "🕵️ Searching for the REAL Header file..."
HEADER_FILE=$(grep -l -r "Ctrl+K" frontend/src | grep ".tsx" | head -n 1)

if [ -z "$HEADER_FILE" ]; then
  # ניסיון גיבוי: חיפוש לפי "Search" ו-"Bell" באותו קובץ
  HEADER_FILE=$(grep -l -r "Bell" frontend/src | xargs grep -l "Search" | head -n 1)
fi

if [ -z "$HEADER_FILE" ]; then
  echo "❌ Error: Could not locate the Header file definitively."
  echo "Please locate the file containing the top search bar manually."
  exit 1
fi

echo "🎯 Found Header at: $HEADER_FILE"

# 3. גיבוי ה-Header האמיתי
cp "$HEADER_FILE" "$HEADER_FILE.bak"

# 4. הוספת ה-Import
if ! grep -q "HelpCircle" "$HEADER_FILE"; then
  sed -i 's/import {/import { HelpCircle,/' "$HEADER_FILE"
fi

# 5. הוספת useNavigate
if ! grep -q "useNavigate" "$HEADER_FILE"; then
   sed -i '1s/^/import { useNavigate } from "react-router-dom";\n/' "$HEADER_FILE"
   # הוספה אחרי הגדרת הפונקציה (מניח שזו פונקציה רגילה או Arrow function)
   # מנסה לתפוס את השורה הראשונה של הפונקציה
   sed -i '/export default function/a \  const navigate = useNavigate();' "$HEADER_FILE" || sed -i '/const .* =.*=>/a \  const navigate = useNavigate();' "$HEADER_FILE"
fi

# 6. הזרקת הכפתור
if ! grep -q "navigate('/admin/help')" "$HEADER_FILE"; then
  echo "💉 Injecting Help Button into Header..."
  
  HELP_BTN='<button onClick={() => navigate("\/admin\/help")} className="p-2 text-slate-400 hover:text-white hover:bg-white\/10 rounded-full transition-colors mx-1" title="מרכז עזרה"><HelpCircle size={20} \/><\/button>'
  
  # מחליף את הפעמון ב-[כפתור עזרה] + [פעמון]
  sed -i "s/<Bell/$HELP_BTN <Bell/" "$HEADER_FILE"
  
  echo "✅ Help button added next to the Bell."
else
  echo "⚠️ Help button already exists in Header."
fi

echo "🚀 Re-building and Deploying..."
cd frontend && npm run build
cd ..
firebase deploy --only hosting
