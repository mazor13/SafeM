#!/bin/bash

echo "🚑 Fixing 404 Error: Connecting the plumbing in App.tsx..."

APP_FILE="frontend/src/App.tsx"
PAGE_FILE="frontend/src/pages/admin/help/HelpCenterPage.tsx"

# 1. וידוא שהדף קיים פיזית (אם לא - יוצר אותו מחדש)
if [ ! -f "$PAGE_FILE" ]; then
    echo "⚠️ HelpCenterPage file missing. Re-creating it..."
    mkdir -p frontend/src/pages/admin/help
    # (הקוד המקוצר לדף, רק כדי שיהיה משהו להציג)
    cat > "$PAGE_FILE" << 'EOF'
import React from 'react';
import { Book, ChevronRight } from 'lucide-react';
export default function HelpCenterPage() {
  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2"><Book className="text-indigo-400"/> מרכז עזרה</h1>
      <p>ברוכים הבאים למרכז העזרה והתיעוד.</p>
    </div>
  );
}
EOF
fi

# 2. גיבוי App.tsx
cp "$APP_FILE" "$APP_FILE.bak"

# 3. הוספת ה-Import (אם חסר)
if ! grep -q "HelpCenterPage" "$APP_FILE"; then
    echo "➕ Adding Import statement..."
    # מוסיף את ה-Import אחרי ה-Imports של React
    sed -i '/import .*from .react.;/a import HelpCenterPage from ".\/pages\/admin\/help\/HelpCenterPage";' "$APP_FILE"
fi

# 4. הוספת ה-Route (אם חסר)
if ! grep -q 'path="help"' "$APP_FILE"; then
    echo "➕ Adding Route definition..."
    
    # אסטרטגיה: לחפש את הנתיב של dashboard (שקיים בטוח) ולהוסיף את help אחריו
    # זה מבטיח שאנחנו בתוך ה-AdminLayout הנכון
    if grep -q 'path="dashboard"' "$APP_FILE"; then
        sed -i '/path="dashboard"/a \          <Route path="help" element={<HelpCenterPage />} />' "$APP_FILE"
        echo "✅ Route registered successfully."
    else
        echo "❌ Could not find 'dashboard' route to anchor the new route."
        echo "Please check App.tsx manually."
        exit 1
    fi
else
    echo "ℹ️ Route already exists."
fi

echo "🚀 Deploying fix..."
cd frontend && npm run build
cd ..
firebase deploy --only hosting
