# OZEN - Sprint 0 Scaffold

This branch contains the Sprint 0 scaffold for the OZEN project.

What is included:
- frontend/ (placeholder)
- functions/ (Firebase Cloud Functions PoC)
- firestore.rules (starter security rules)
- .env.example (placeholders)
- .github/workflows/ (CI + deploy workflows)
- ISSUES_BACKLOG.md (MVP backlog)

How to run locally (Firebase emulator):
1. Install dependencies (root and functions):
   - npm install
   - cd functions && npm install
2. Start emulators:
   - firebase emulators:start --only firestore,functions,auth,storage
3. Run the frontend (if implemented):
   - npm run dev

Notes:
- This is a scaffold for Sprint 0. It contains a PoC Cloud Function for PDF generation (functions/src/index.ts) and optional KMS signing when KMS is configured.
- Replace placeholders in .env.example with real values and add GCP service account JSON to GitHub Secrets as `GCP_SA_KEY`.
