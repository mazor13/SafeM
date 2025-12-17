// Configure emulator endpoints expected by tests
process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || 'localhost:9099';
process.env.FIREBASE_PROJECT = process.env.FIREBASE_PROJECT || 'ozen-staging-2025';
process.env.STORAGE_EMULATOR_HOST = process.env.STORAGE_EMULATOR_HOST || 'http://localhost:9199';
process.env.KMS_KEY_NAME = process.env.KMS_KEY_NAME || '';
