# Runbook: PDF Signing (KMS) & Verification — SafeM

## Status
- **Environment:** ozen-staging-2025 (GCP)
- **Functions:** `generatePdfReport`, `verifySignatureEndpoint` (Gen‑2, Node 20, region `us-central1`)
- **KMS key:** `projects/ozen-staging-2025/locations/us-central1/keyRings/ozen-keyring/cryptoKeys/ozen-signing-key`
- **Verification CLI:** `scripts/verify_document.js`
- **Rotation script:** `scripts/rotate_kms_key.js`
- **CI verification workflow:** `.github/workflows/post-deploy.yml`
- **Rotation workflow:** `.github/workflows/rotate-kms.yml`

## Table of contents
1. Purpose
2. Roles & Permissions
3. Key concepts
4. Pre-rotation checklist
5. Manual rotation (step-by-step)
6. Automated rotation (CI)
7. Post-update verification
8. Rollback procedure
9. Emergency key revocation
10. Troubleshooting
11. Monitoring & alerts
12. Audit & logging
13. Contacts

## 1. Purpose
This runbook documents safe procedures to rotate KMS key versions used to sign generated PDFs, verify signatures, and recover from failures.

## 2. Roles & Permissions
- **Rotation Service Account (rotation SA):**
  - Required: permission to create key versions and update Gen‑2 function env:
    - `roles/cloudkms.admin` OR granular: `cloudkms.cryptoKeyVersions.create`
    - `roles/run.admin` or `run.services.update` for Cloud Run (Gen‑2) service update
- **Verification Service Account (verifier-sa):**
  - `roles/datastore.viewer` (Firestore read)
  - `roles/storage.objectViewer` (bucket object read)
  - `roles/cloudkms.publicKeyViewer` (getPublicKey)
- **CI/Deployment SA:**
  - `artifactregistry.writer` (for deployment), cloudfunctions deploy permissions, etc.

*Note: Use least privilege and resource-scoped bindings whenever possible.*

## 3. Key concepts
- KMS key versions are referenced with full resource name:
  `projects/<proj>/locations/<loc>/keyRings/<ring>/cryptoKeys/<key>/cryptoKeyVersions/<n>`
- We store the exact `keyVersion` used for signing in Firestore documents (field `keyVersion`) for auditability.
- Verify signatures by retrieving public key PEM for the same keyVersion and verifying RSA-SHA256 of the original file bytes.

## 4. Pre-rotation checklist (do before rotating)
1. Ensure a current smoke doc exists and its `documentId` is stored in `SMOKE_DOC_ID` secret.
2. Ensure rotation SA key is stored in GitHub Secret `ROTATE_SA_KEY` for the rotate workflow.
3. Confirm verify CLI `scripts/verify_document.js` works locally with ADC or SA key.
4. Pick a maintenance window if rotating production.
5. Make a backup of relevant IAM policies:
   ```bash
   gcloud projects get-iam-policy ozen-staging-2025 --format=json > iam-policy.backup.json