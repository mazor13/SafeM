# Sprint 0 Backlog - MVP scaffolding

This file contains the initial backlog items to be opened as GitHub Issues for Sprint 0.

1. Project scaffold
   - Create repo structure: frontend/, functions/, docs/, .github/workflows
   - Add .env.example and README
   - Estimate: 1 day

2. Firestore security rules
   - Add starter rules (organizations, inspections, documents, audit_log)
   - Add test plan for emulator
   - Estimate: 0.5 day

3. Cloud Function PoC: generatePdfReport
   - Implement PoC function to generate PDF, compute SHA-256, save to Storage
   - Optionally sign using Cloud KMS if KMS configured
   - Estimate: 0.5 day

4. CI: GitHub Actions
   - Add basic CI workflow (build/test) and document how to add GCP secrets
   - Add deploy-staging workflow to create KMS keyring/key and deploy functions
   - Estimate: 0.5 day

5. Backlog: Create detailed issues for MVP features
   - Authentication (Firebase Auth + custom claims)
   - Inspections CRUD
   - Findings CRUD
   - Client management
   - Storage integration
   - PDF generation and signing
   - Offline PWA setup (IndexedDB + Workbox)
   - Estimate: 1 day to detail and create issues

6. Docs: ADR and developer onboarding
   - Add ADR for KMS PoC vs X.509/TSA
   - Add developer runbook to run emulator locally
   - Estimate: 0.5 day

Total estimated: 3.5 - 5 days for Sprint 0 deliverables.
