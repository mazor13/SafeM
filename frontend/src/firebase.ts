import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// שליפת משתני הסביבה (Vite)
const {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID,
} = import.meta.env;

// בדיקת תקינות - תוודא שלא שכחנו כלום
function assertEnv(name: string, value?: string) {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Missing required environment variable ${name}. Check .env.local`);
  }
}

// בדיקה שהמפתחות נטענו
assertEnv('VITE_FIREBASE_API_KEY', VITE_FIREBASE_API_KEY);
assertEnv('VITE_FIREBASE_AUTH_DOMAIN', VITE_FIREBASE_AUTH_DOMAIN);
assertEnv('VITE_FIREBASE_PROJECT_ID', VITE_FIREBASE_PROJECT_ID);

const firebaseConfig: FirebaseOptions = {
  apiKey: VITE_FIREBASE_API_KEY!,
  authDomain: VITE_FIREBASE_AUTH_DOMAIN!,
  projectId: VITE_FIREBASE_PROJECT_ID!,
  storageBucket: VITE_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID!,
};

// אתחול Singleton
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.info(`Firebase initialized for project: ${firebaseConfig.projectId}`);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;
