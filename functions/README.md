# SafeM Cloud Functions

Firebase Cloud Functions for the SafeM safety inspection platform, using Node 20 and Gen-2 architecture.

## Setup

### Prerequisites

- Node.js 20.x
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project with Cloud Functions enabled

### Installation

```bash
cd functions
npm install
```

### Environment Variables

The following environment variables should be configured in Firebase:

- `KMS_KEY_NAME` (optional): Google Cloud KMS key for digital signing
  - Format: `projects/PROJECT_ID/locations/LOCATION/keyRings/RING_ID/cryptoKeys/KEY_ID/cryptoKeyVersions/VERSION`
  - If not provided, PDFs will be generated without digital signatures

## Development

### Build

Compile TypeScript to JavaScript:

```bash
npm run build
```

### Local Testing

Run functions locally using Firebase emulators:

```bash
npm run serve
```

### Linting

```bash
npm run lint
```

## Deployment

Deploy to Firebase:

```bash
npm run deploy
```

Or deploy specific function:

```bash
firebase deploy --only functions:generatePdfReport
```

## Functions

### generatePdfReport

**Region:** us-central1  
**Type:** HTTPS (Gen-2)  
**Runtime:** Node 20

Generates a PDF report for an inspection with the following features:

- Creates PDF using pdf-lib
- Calculates SHA-256 hash of PDF content
- Signs document using Google Cloud KMS (if configured)
- Uploads PDF to Firebase Storage at `reports/{inspectionId}.pdf`
- Saves metadata to Firestore `documents` collection

#### Request

**Method:** POST  
**Content-Type:** application/json

**Body:**
```json
{
  "inspectionId": "string (required)",
  "title": "string (optional)",
  "content": "string (optional)"
}
```

#### Response

**Success (200):**
```json
{
  "success": true,
  "inspectionId": "string",
  "documentId": "string",
  "fileName": "string",
  "hash": "string",
  "size": number,
  "signed": boolean
}
```

**Error (400/413/500):**
```json
{
  "error": "string",
  "message": "string"
}
```

#### Limitations

- Maximum PDF size: 10MB
- Only POST requests accepted

## Architecture

### Technology Stack

- **Runtime:** Node.js 20
- **Framework:** Firebase Functions Gen-2 (v4.x)
- **Admin SDK:** Firebase Admin SDK v11.x
- **PDF Generation:** pdf-lib v1.17.x
- **Digital Signing:** Google Cloud KMS v3.8.x
- **Language:** TypeScript 5.x

### Storage Structure

```
Firebase Storage:
├── reports/
│   ├── {inspectionId1}.pdf
│   ├── {inspectionId2}.pdf
│   └── ...

Firestore:
├── documents/
│   ├── {documentId1}
│   │   ├── inspectionId: string
│   │   ├── fileName: string
│   │   ├── storagePath: string
│   │   ├── hash: string (SHA-256)
│   │   ├── signature: string (base64)
│   │   ├── createdAt: timestamp
│   │   ├── type: "inspection_report"
│   │   └── size: number
│   └── ...
```

## Security

- All PDFs are signed with Google Cloud KMS for integrity verification
- SHA-256 hashes are stored for each document
- File size limits prevent storage abuse
- Proper error handling and logging throughout

## Troubleshooting

### KMS Signing Errors

If you see `KMS_SIGNING_FAILED` in logs:
1. Verify `KMS_KEY_NAME` environment variable is set correctly
2. Check that the service account has `cloudkms.cryptoKeyVersions.useToSign` permission
3. Ensure the KMS key exists and is enabled

### Build Errors

If TypeScript compilation fails:
```bash
# Clean and rebuild
rm -rf lib/
npm run build
```

### Storage Upload Errors

If PDF upload fails:
1. Verify Firebase Storage is enabled in the Firebase console
2. Check Storage rules allow writes
3. Verify service account has storage permissions

## License

Internal project - proprietary
