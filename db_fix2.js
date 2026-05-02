import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import fs from 'fs';

// Manually parse .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^"|'|$/g, '').replace(/"|'|$/g, '');
  }
});

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
  // 1. Fix Products
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

  // 2. Get Categories and Delete 'Ropa'
  const catSnap = await getDocs(collection(db, "categories"));
  const categories = catSnap.docs.map(d => ({id: d.id, ...d.data()}));
  const ropaCat = categories.find(c => c.name.toLowerCase() === 'ropa');
  if (ropaCat) {
    console.log(`Found 'Ropa' category: ${ropaCat.id}. Deleting it...`);
    await deleteDoc(doc(db, "categories", ropaCat.id));
    console.log("Deleted 'Ropa' category.");
  }
}

run().catch(console.error);
