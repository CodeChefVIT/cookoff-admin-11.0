import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import { env } from '@/env';

// Prefer env-provided values so each edition can point at its own Firebase
// project without a code change. Values fall back to the last known project
// until the deployment env is populated.
const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyD0qhzZneFjkHA-JnTukWhDSdDvu_rZgso',
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'cookoff-10599.firebaseapp.com',
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'cookoff-10599',
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'cookoff-10599.firebasestorage.app',
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '601154988337',
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:601154988337:web:ae244bba23d76d649da810',
  measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-M171Y6W1V0',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
