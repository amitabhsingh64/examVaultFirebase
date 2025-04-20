import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8kXESEEmnnZR0JKuAlhGrwdN4_0qep6k",
  authDomain: "examvault-e1dcb.firebaseapp.com",
  projectId: "examvault-e1dcb",
  storageBucket: "examvault-e1dcb.firebasestorage.app",
  messagingSenderId: "956841044782",
  appId: "1:956841044782:web:8738d4c3781f9b097168bf",
  measurementId: "G-BBSQ5TPN40"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

let analytics: Analytics;
let db: Firestore;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
db = getFirestore(app);

export { app, analytics, db };
