import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyAw_...", // I'll need to read .env.local for the real ones
};

// Instead of hardcoding, I'll read .env.local
import fs from 'fs';
import dotenv from 'dotenv';
const env = dotenv.parse(fs.readFileSync('.env.local'));

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
});

const db = getFirestore(app);

async function run() {
  // 1. Get Categories
  const catSnap = await getDocs(collection(db, "categories"));
  const categories = catSnap.docs.map(d => ({id: d.id, ...d.data()}));
  console.log("CATEGORIES:");
  categories.forEach(c => console.log(`- ${c.id}: ${c.name}`));

  // If there's a category named 'Ropa', delete it or rename its products to 'Indumentaria'
  const ropaCat = categories.find(c => c.name.toLowerCase() === 'ropa');
  if (ropaCat) {
    console.log(`Found 'Ropa' category: ${ropaCat.id}. Deleting it...`);
    await deleteDoc(doc(db, "categories", ropaCat.id));
    console.log("Deleted 'Ropa' category.");
  }

  // 2. Fix Products
  const prodSnap = await getDocs(collection(db, "products"));
  let updatedCount = 0;
  for (const p of prodSnap.docs) {
    const data = p.data();
    if (data.category && data.category.toLowerCase() === 'ropa') {
      await updateDoc(doc(db, "products", p.id), { category: 'Indumentaria' });
      updatedCount++;
    }
  }
  console.log(`Updated ${updatedCount} products from 'Ropa' to 'Indumentaria'.`);
}

run().catch(console.error);
