
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Ensure projectId is available before initializing Firestore
// This check helps prevent errors during build or if env vars are missing client-side initially
if (firebaseConfig.projectId) {
    db = getFirestore(app);
} else {
    console.warn("Firebase projectId is not available. Firestore will not be initialized.");
    // You might want to assign a mock/dummy db object here if your app expects db to be defined
    // For example: db = {} as Firestore; (This is a type assertion and should be used carefully)
    // Or ensure components handle db being potentially undefined.
}


export { app, db };
