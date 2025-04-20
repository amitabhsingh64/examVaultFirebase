// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore, FirebaseFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app: any;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // if already initialized, use that one
}

let analytics: Analytics;
let db: FirebaseFirestore;

if (typeof window !== 'undefined' &&
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId &&
    firebaseConfig.measurementId) {
  analytics = getAnalytics(app);
  db = getFirestore(app);
} else {
  console.warn("Firebase configuration is incomplete. Make sure all environment variables are set.");
}

export { app, analytics, db };
