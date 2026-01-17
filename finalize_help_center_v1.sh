#!/bin/bash

echo "🚀 Finalizing Help Center (Static Hub) & Logging Future Tasks..."

# 1. יצירת/עדכון קובץ משימות בתוך ה-Repo (כדי שזה יהיה מתועד ב-Git)
# אנחנו מוסיפים את משימת ה-CMS לרשימת המשימות העתידיות
cat >> ROADMAP.md << 'EOF'

## 📝 Future Tasks (Backlog)
- [ ] **HELP CENTER PHASE 2:** Implement CMS & In-App Editing (Rich Text Editor).
      * Allow admins to edit content directly.
      * Store articles in Firestore 'help_docs' collection.
      * Add "Edit Mode" toggle.
EOF

echo "✅ Added 'CMS for Help Center' to ROADMAP.md"

# 2. ביצוע GIT MERGE (סגירת הגרסה הנוכחית)
echo "🔄 Starting Git Merge Process..."

# מוודאים שאנחנו ב-Branch הנכון
git checkout feat/sales-core 2>/dev/null || git checkout -b feat/sales-core

git add .
git commit -m "feat(help): implement professional documentation hub (static v1) and update roadmap"

# מעבר ל-Main, משיכה ומיזוג
git checkout main
git pull origin main
git merge feat/sales-core --no-edit

echo "🚀 Pushing to Production (GitHub)..."
git push origin main

# 3. פריסה ל-Firebase (הגרסה היציבה)
echo "🔥 Deploying to Firebase Hosting..."
cd frontend && npm run build
cd ..
firebase deploy --only hosting

echo "🎉 MISSION COMPLETE! Help Center is LIVE."
echo "👉 Future task (CMS) is documented in ROADMAP.md"
