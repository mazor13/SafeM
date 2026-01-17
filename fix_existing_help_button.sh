#!/bin/bash

echo "🛠️ Rewiring the existing Help Button to the new Help Center..."

TARGET_FILE="frontend/src/layouts/AdminLayout.tsx"

# 1. גיבוי
cp "$TARGET_FILE" "$TARGET_FILE.bak"

# 2. החלפת הפעולה של הכפתור
# אנחנו מחפשים את השורה: onClick={() => setShowHelp(true)}
# ומחליפים אותה ב: onClick={() => navigate('/admin/help')}
sed -i "s/onClick={() => setShowHelp(true)}/onClick={() => navigate('\/admin\/help')}/" "$TARGET_FILE"

echo "✅ Button redirected to /admin/help"

# 3. ניקוי רעשים (אופציונלי)
# אפשר להסיר את ה-Point הירוק אם אתה רוצה (הוא מסמן "חדש", אז אולי נשאיר אותו)

echo "🚀 Deploying..."
cd frontend && npm run build
cd ..
firebase deploy --only hosting
