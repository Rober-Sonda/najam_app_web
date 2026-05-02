import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBmmYAC1hmDeF2Wwcg3ErL9uacYHk6mkw8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "studio-3499438068-fdc5a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "studio-3499438068-fdc5a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "studio-3499438068-fdc5a.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "456755860401",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:456755860401:web:ec3838fc8a78328427a390"
};

let app;
let auth;
let googleProvider;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Firebase initialization error. Please check your .env variables.", error);
}

export { auth, googleProvider, db, storage };
export default app;
