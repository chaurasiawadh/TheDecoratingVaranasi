import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6ZwxrEPmpvA9j7HYX65qSa-AN4QrHSs8",
  authDomain: "thedecoratingvaranasi-27aeb.firebaseapp.com",
  projectId: "thedecoratingvaranasi-27aeb",
  storageBucket: "thedecoratingvaranasi-27aeb.firebasestorage.app",
  messagingSenderId: "806526508170",
  appId: "1:806526508170:web:37ea4a5deeffc7da33a173",
  measurementId: "G-PFXJQ1YS6L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);