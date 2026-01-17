#!/bin/bash

echo "🚑 Final Fix for GlobalSearch.tsx..."

TARGET_FILE="frontend/src/components/search/GlobalSearch.tsx"

# 1. שחזור מהגיבוי (כדי להתחיל מדף נקי בלי כפילויות)
if [ -f "$TARGET_FILE.bak" ]; then
    cp "$TARGET_FILE.bak" "$TARGET_FILE"
    echo "✅ Restored clean file from backup."
else
    echo "⚠️ No backup found. Fixing duplicate imports manually..."
    # במקרה שאין גיבוי, נמחוק את הכפילות ידנית
    sed -i 's/useNavigate, useNavigate/useNavigate/g' "$TARGET_FILE"
fi

# 2. הוספת HelpCircle (רק אם חסר)
if ! grep -q "HelpCircle" "$TARGET_FILE"; then
    sed -i "/from 'lucide-react'/s/import {/import { HelpCircle,/" "$TARGET_FILE"
    echo "✅ Added HelpCircle import."
fi

# 3. הוספת useNavigate (רק אם חסר!)
if ! grep -q "useNavigate" "$TARGET_FILE"; then
    if grep -q "react-router-dom" "$TARGET_FILE"; then
        # אם יש ייבוא קיים מ-router, נוסיף לו
        sed -i "/from 'react-router-dom'/s/import {/import { useNavigate,/" "$TARGET_FILE"
    else
        # אם אין בכלל ייבוא, נוסיף שורה חדשה
        sed -i '1s/^/import { useNavigate } from "react-router-dom";\n/' "$TARGET_FILE"
    fi
    echo "✅ Added useNavigate import."
else
    echo "ℹ️ useNavigate already exists. Skipping."
fi

# 4. הוספת ה-Hook בתוך הפונקציה (רק אם חסר)
if ! grep -q "const navigate =" "$TARGET_FILE"; then
     # מנסה להוסיף אחרי הגדרת הפונקציה
     sed -i '/export default function/a \  const navigate = useNavigate();' "$TARGET_FILE" || sed -i '/const .* =.*=>/a \  const navigate = useNavigate();' "$TARGET_FILE"
     echo "✅ Added navigate hook."
fi

# 5. הזרקת הכפתור
if ! grep -q "navigate('/admin/help')" "$TARGET_FILE"; then
  echo "💉 Injecting Help Button..."
  HELP_BTN='<button onClick={() => navigate("\/admin\/help")} className="p-2 text-slate-400 hover:text-white hover:bg-white\/10 rounded-full transition-colors mx-1" title="מרכז עזרה"><HelpCircle size={20} \/><\/button>'
  sed -i "s/<Bell/$HELP_BTN <Bell/" "$TARGET_FILE"
fi

echo "🚀 Deploying fixed version..."
cd frontend && npm run build
cd ..
firebase deploy --only hosting
