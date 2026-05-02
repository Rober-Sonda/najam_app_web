import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmmYAC1hmDeF2Wwcg3ErL9uacYHk6mkw8",
  authDomain: "studio-3499438068-fdc5a.firebaseapp.com",
  projectId: "studio-3499438068-fdc5a",
  storageBucket: "studio-3499438068-fdc5a.appspot.com",
  messagingSenderId: "456755860401",
  appId: "1:456755860401:web:ec3838fc8a78328427a390"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = [
  { name: "Remera Oversize Black Label", category: "Indumentaria", costPrice: 5000, salePrice: 15000, stock: 20, isVIPOnly: false, imageUrl: "/cat_apparel.png" },
  { name: "Buzo Hoodie Exclusive VIP", category: "Indumentaria", costPrice: 12000, salePrice: 35000, stock: 15, isVIPOnly: true, imageUrl: "/cat_apparel.png" },
  { name: "Zapatillas Urban High-Top", category: "Calzado", costPrice: 25000, salePrice: 65000, stock: 10, isVIPOnly: false, imageUrl: "/cat_shoes.png" },
  { name: "Sneakers Limited Edition", category: "Calzado", costPrice: 30000, salePrice: 85000, stock: 5, isVIPOnly: true, imageUrl: "/cat_shoes.png" },
  { name: "Reloj Minimalista Onyx", category: "Accesorios", costPrice: 15000, salePrice: 45000, stock: 5, isVIPOnly: true, imageUrl: "/cat_accessories.png" },
  { name: "Gorra Snapback NAJAM", category: "Accesorios", costPrice: 3000, salePrice: 9000, stock: 50, isVIPOnly: false, imageUrl: "/cat_accessories.png" },
  { name: "Perfume 'Nocturno' 100ml", category: "Fragancias", costPrice: 8000, salePrice: 28000, stock: 30, isVIPOnly: false, imageUrl: "/cat_fragrances.png" }
];

async function seed() {
  console.log("Seeding started...");
  for (const p of products) {
    try {
      await addDoc(collection(db, "products"), { ...p, createdAt: new Date(), updatedAt: new Date() });
      console.log("Added: " + p.name);
    } catch(err) {
      console.error("Error adding " + p.name, err);
    }
  }
  console.log("Seeding complete!");
  process.exit(0);
}

seed();
