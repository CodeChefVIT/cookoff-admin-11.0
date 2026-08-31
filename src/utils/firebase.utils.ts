import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD0qhzZneFjkHA-JnTukWhDSdDvu_rZgso',
  authDomain: 'cookoff-10599.firebaseapp.com',
  projectId: 'cookoff-10599',
  storageBucket: 'cookoff-10599.firebasestorage.app',
  messagingSenderId: '601154988337',
  appId: '1:601154988337:web:ae244bba23d76d649da810',
  measurementId: 'G-M171Y6W1V0',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
