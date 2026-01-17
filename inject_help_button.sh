#!/bin/bash

echo "💉 Injecting Help Button into existing Sidebar..."

TARGET_FILE="frontend/src/components/layout/Sidebar.tsx"

# 1. הוספת האייקון HelpCircle לרשימת הייבוא (Imports)
# אנחנו מחפשים את השורה שמייבאת מ-lucide-react ומוסיפים לה את HelpCircle
sed -i 's/import {/import { HelpCircle,/' "$TARGET_FILE"

# 2. הזרקת הכפתור לתחתית התפריט
# אנחנו מחפשים את תגית הסגירה של ה-nav ומוסיפים לפניה את הכפתור החדש
sed -i '/<\/nav>/i \        <div className="my-2 border-t border-white/5 mx-2"></div>' "$TARGET_FILE"
sed -i '/<\/nav>/i \        <NavItem to="/admin/help" icon={HelpCircle} label="מרכז עזרה" />' "$TARGET_FILE"

echo "✅ Help button injected safely."

# 3. בנייה ופריסה מחדש
cd frontend && npm run build
cd ..
firebase deploy --only hosting
