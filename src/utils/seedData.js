import { collection, addDoc, getDocs } from 'firebase/firestore';

export const seedDatabase = async (db) => {
  // 1. Seed Categories
  const categories = [
    { name: "Indumentaria", options: "S, M, L, XL" },
    { name: "Fragancias", options: "50ml, 100ml" },
    { name: "Accesorios & Relojes", options: "" },
    { name: "Calzado", options: "38, 39, 40, 41, 42, 43" }
  ];
  
  const existingCatsSnapshot = await getDocs(collection(db, "categories"));
  const existingCats = existingCatsSnapshot.docs.map(d => d.data().name);
  
  for (const cat of categories) {
    if (!existingCats.includes(cat.name)) {
      await addDoc(collection(db, "categories"), cat);
    }
  }

  // 2. Seed Brands
  const brands = [
    { name: "ZARA", linkedCategories: ["Indumentaria", "Calzado", "Accesorios & Relojes", "Fragancias"] },
    { name: "NIKE", linkedCategories: ["Indumentaria", "Calzado", "Accesorios & Relojes"] },
    { name: "PUMA", linkedCategories: ["Indumentaria", "Calzado", "Accesorios & Relojes"] },
    { name: "LEVI'S", linkedCategories: ["Indumentaria", "Accesorios & Relojes"] },
    { name: "ADIDAS", linkedCategories: ["Indumentaria", "Calzado", "Accesorios & Relojes"] },
    { name: "TOMMY HILFIGER", linkedCategories: ["Indumentaria", "Calzado", "Accesorios & Relojes"] },
    { name: "CONVERSE", linkedCategories: ["Calzado"] },
    { name: "VANS", linkedCategories: ["Calzado"] },
    { name: "TIMBERLAND", linkedCategories: ["Calzado"] },
    { name: "CASIO", linkedCategories: ["Accesorios & Relojes"] },
    { name: "RAY-BAN", linkedCategories: ["Accesorios & Relojes"] },
    { name: "ARMANI", linkedCategories: ["Fragancias"] },
    { name: "CALVIN KLEIN", linkedCategories: ["Fragancias"] },
    { name: "DIOR", linkedCategories: ["Fragancias"] },
    { name: "VICTORIA'S SECRET", linkedCategories: ["Fragancias"] },
    { name: "CHANEL", linkedCategories: ["Fragancias"] },
    { name: "PACO RABANNE", linkedCategories: ["Fragancias"] },
    { name: "CAROLINA HERRERA", linkedCategories: ["Fragancias"] },
    { name: "HUGO BOSS", linkedCategories: ["Fragancias"] },
    { name: "DOLCE & GABBANA", linkedCategories: ["Fragancias"] },
    { name: "JEAN PAUL GAULTIER", linkedCategories: ["Fragancias"] },
    { name: "VERSACE", linkedCategories: ["Fragancias"] },
    { name: "RALPH LAUREN", linkedCategories: ["Fragancias"] }
  ];

  const existingBrandsSnapshot = await getDocs(collection(db, "brands"));
  const existingBrandNames = existingBrandsSnapshot.docs.map(d => d.data().name);

  for (const brand of brands) {
    if (!existingBrandNames.includes(brand.name)) {
      await addDoc(collection(db, "brands"), brand);
    }
  }

  // 3. Seed Products
  const products = [
    // --- INDUMENTARIA (15) ---
    { name: "Remera Oversize Básica", category: "Indumentaria", brand: "ZARA", costPrice: 8000, salePrice: 22000, stock: 30, imageUrl: "/cat_apparel_new.png" },
    { name: "Hoodie Essential", category: "Indumentaria", brand: "NIKE", costPrice: 25000, salePrice: 65000, stock: 15, imageUrl: "/cat_apparel_new.png" },
    { name: "Pantalón Cargo Tech", category: "Indumentaria", brand: "PUMA", costPrice: 18000, salePrice: 45000, stock: 20, imageUrl: "/cat_apparel_new.png" },
    { name: "Campera Puffer Minimal", category: "Indumentaria", brand: "ZARA", costPrice: 35000, salePrice: 89000, stock: 10, imageUrl: "/cat_apparel_new.png" },
    { name: "Remera Estampada Vintage", category: "Indumentaria", brand: "LEVI'S", costPrice: 9000, salePrice: 24000, stock: 25, imageUrl: "/cat_apparel_new.png" },
    { name: "Jean Mom Fit Clásico", category: "Indumentaria", brand: "LEVI'S", costPrice: 22000, salePrice: 55000, stock: 18, imageUrl: "/cat_apparel_new.png" },
    { name: "Buzo Cuello Redondo", category: "Indumentaria", brand: "ADIDAS", costPrice: 20000, salePrice: 52000, stock: 22, imageUrl: "/cat_apparel_new.png" },
    { name: "Camisa de Lino", category: "Indumentaria", brand: "TOMMY HILFIGER", costPrice: 28000, salePrice: 75000, stock: 12, imageUrl: "/cat_apparel_new.png" },
    { name: "Short Deportivo Running", category: "Indumentaria", brand: "NIKE", costPrice: 12000, salePrice: 29000, stock: 30, imageUrl: "/cat_apparel_new.png" },
    { name: "Jogging Algodón Premium", category: "Indumentaria", brand: "PUMA", costPrice: 15000, salePrice: 38000, stock: 20, imageUrl: "/cat_apparel_new.png" },
    { name: "Sweater Tejido Grueso", category: "Indumentaria", brand: "ZARA", costPrice: 19000, salePrice: 49000, stock: 14, imageUrl: "/cat_apparel_new.png" },
    { name: "Chaleco Acolchado", category: "Indumentaria", brand: "TOMMY HILFIGER", costPrice: 32000, salePrice: 85000, stock: 8, imageUrl: "/cat_apparel_new.png" },
    { name: "Musculosa Básica", category: "Indumentaria", brand: "ZARA", costPrice: 5000, salePrice: 12000, stock: 40, imageUrl: "/cat_apparel_new.png" },
    { name: "Pantalón Sastrero Recto", category: "Indumentaria", brand: "ZARA", costPrice: 24000, salePrice: 62000, stock: 15, imageUrl: "/cat_apparel_new.png" },
    { name: "Rompevientos Ligero", category: "Indumentaria", brand: "ADIDAS", costPrice: 26000, salePrice: 68000, stock: 12, imageUrl: "/cat_apparel_new.png" },

    // --- CALZADO (15) ---
    { name: "Zapatillas Air Max", category: "Calzado", brand: "NIKE", costPrice: 45000, salePrice: 120000, stock: 10, imageUrl: "/cat_shoes.png" },
    { name: "Zapatillas Superstar", category: "Calzado", brand: "ADIDAS", costPrice: 40000, salePrice: 110000, stock: 15, imageUrl: "/cat_shoes.png" },
    { name: "Zapatillas RS-X", category: "Calzado", brand: "PUMA", costPrice: 38000, salePrice: 95000, stock: 12, imageUrl: "/cat_shoes.png" },
    { name: "Botas de Cuero Chelsea", category: "Calzado", brand: "ZARA", costPrice: 55000, salePrice: 140000, stock: 8, imageUrl: "/cat_shoes.png" },
    { name: "Zapatillas Chuck Taylor", category: "Calzado", brand: "CONVERSE", costPrice: 30000, salePrice: 75000, stock: 25, imageUrl: "/cat_shoes.png" },
    { name: "Zapatillas Old Skool", category: "Calzado", brand: "VANS", costPrice: 32000, salePrice: 80000, stock: 20, imageUrl: "/cat_shoes.png" },
    { name: "Mocasines Clásicos", category: "Calzado", brand: "TOMMY HILFIGER", costPrice: 50000, salePrice: 130000, stock: 6, imageUrl: "/cat_shoes.png" },
    { name: "Zapatillas Running Ultraboost", category: "Calzado", brand: "ADIDAS", costPrice: 60000, salePrice: 160000, stock: 10, imageUrl: "/cat_shoes.png" },
    { name: "Zapatillas Air Force 1", category: "Calzado", brand: "NIKE", costPrice: 48000, salePrice: 135000, stock: 12, imageUrl: "/cat_shoes.png" },
    { name: "Sandalias Slide", category: "Calzado", brand: "PUMA", costPrice: 15000, salePrice: 35000, stock: 30, imageUrl: "/cat_shoes.png" },
    { name: "Botines Deportivos", category: "Calzado", brand: "NIKE", costPrice: 55000, salePrice: 145000, stock: 8, imageUrl: "/cat_shoes.png" },
    { name: "Zapatos Oxford", category: "Calzado", brand: "ZARA", costPrice: 42000, salePrice: 115000, stock: 10, imageUrl: "/cat_shoes.png" },
    { name: "Zapatillas Slip-On", category: "Calzado", brand: "VANS", costPrice: 28000, salePrice: 70000, stock: 18, imageUrl: "/cat_shoes.png" },
    { name: "Zapatillas Platform", category: "Calzado", brand: "CONVERSE", costPrice: 35000, salePrice: 88000, stock: 15, imageUrl: "/cat_shoes.png" },
    { name: "Botas Outdoor", category: "Calzado", brand: "TIMBERLAND", costPrice: 70000, salePrice: 190000, stock: 5, imageUrl: "/cat_shoes.png" },

    // --- ACCESORIOS & RELOJES (15) ---
    { name: "Reloj Minimalista Classic", category: "Accesorios & Relojes", brand: "CASIO", costPrice: 18000, salePrice: 45000, stock: 20, imageUrl: "/cat_accessories.png" },
    { name: "Gorra Snapback Logo", category: "Accesorios & Relojes", brand: "NIKE", costPrice: 8000, salePrice: 22000, stock: 25, imageUrl: "/cat_accessories.png" },
    { name: "Riñonera Urbana", category: "Accesorios & Relojes", brand: "ADIDAS", costPrice: 12000, salePrice: 32000, stock: 15, imageUrl: "/cat_accessories.png" },
    { name: "Lentes de Sol Aviador", category: "Accesorios & Relojes", brand: "RAY-BAN", costPrice: 45000, salePrice: 120000, stock: 8, imageUrl: "/cat_accessories.png" },
    { name: "Cinturón de Cuero", category: "Accesorios & Relojes", brand: "LEVI'S", costPrice: 15000, salePrice: 38000, stock: 20, imageUrl: "/cat_accessories.png" },
    { name: "Mochila Tech", category: "Accesorios & Relojes", brand: "PUMA", costPrice: 22000, salePrice: 55000, stock: 12, imageUrl: "/cat_accessories.png" },
    { name: "Reloj Digital Vintage", category: "Accesorios & Relojes", brand: "CASIO", costPrice: 20000, salePrice: 50000, stock: 18, imageUrl: "/cat_accessories.png" },
    { name: "Billetera de Cuero", category: "Accesorios & Relojes", brand: "TOMMY HILFIGER", costPrice: 18000, salePrice: 48000, stock: 15, imageUrl: "/cat_accessories.png" },
    { name: "Collar Cadena Plata", category: "Accesorios & Relojes", brand: "ZARA", costPrice: 6000, salePrice: 18000, stock: 30, imageUrl: "/cat_accessories.png" },
    { name: "Anillo Acero Quirúrgico", category: "Accesorios & Relojes", brand: "ZARA", costPrice: 3000, salePrice: 9000, stock: 40, imageUrl: "/cat_accessories.png" },
    { name: "Medias Invisibles x3", category: "Accesorios & Relojes", brand: "NIKE", costPrice: 4000, salePrice: 12000, stock: 50, imageUrl: "/cat_accessories.png" },
    { name: "Gorro Beanie Invierno", category: "Accesorios & Relojes", brand: "ADIDAS", costPrice: 7000, salePrice: 19000, stock: 22, imageUrl: "/cat_accessories.png" },
    { name: "Reloj Cronógrafo", category: "Accesorios & Relojes", brand: "TOMMY HILFIGER", costPrice: 65000, salePrice: 175000, stock: 5, imageUrl: "/cat_accessories.png" },
    { name: "Bolso Deportivo Duffle", category: "Accesorios & Relojes", brand: "NIKE", costPrice: 28000, salePrice: 72000, stock: 10, imageUrl: "/cat_accessories.png" },
    { name: "Pulsera de Cuero Trenzado", category: "Accesorios & Relojes", brand: "ZARA", costPrice: 5000, salePrice: 15000, stock: 25, imageUrl: "/cat_accessories.png" },

    // --- FRAGANCIAS (15) ---
    { name: "Eau de Parfum 'Acqua'", category: "Fragancias", brand: "ARMANI", costPrice: 55000, salePrice: 145000, stock: 15, imageUrl: "/cat_fragrances.png" },
    { name: "Perfume 'One'", category: "Fragancias", brand: "CALVIN KLEIN", costPrice: 35000, salePrice: 92000, stock: 20, imageUrl: "/cat_fragrances.png" },
    { name: "Fragancia 'Sauvage'", category: "Fragancias", brand: "DIOR", costPrice: 70000, salePrice: 180000, stock: 10, imageUrl: "/cat_fragrances.png" },
    { name: "Body Splash Tropical", category: "Fragancias", brand: "VICTORIA'S SECRET", costPrice: 12000, salePrice: 32000, stock: 40, imageUrl: "/cat_fragrances.png" },
    { name: "Perfume 'Bleu'", category: "Fragancias", brand: "CHANEL", costPrice: 85000, salePrice: 210000, stock: 8, imageUrl: "/cat_fragrances.png" },
    { name: "Eau de Toilette 'Invictus'", category: "Fragancias", brand: "PACO RABANNE", costPrice: 52000, salePrice: 138000, stock: 12, imageUrl: "/cat_fragrances.png" },
    { name: "Fragancia Femenina 'Good Girl'", category: "Fragancias", brand: "CAROLINA HERRERA", costPrice: 65000, salePrice: 165000, stock: 14, imageUrl: "/cat_fragrances.png" },
    { name: "Perfume '212 VIP'", category: "Fragancias", brand: "CAROLINA HERRERA", costPrice: 60000, salePrice: 155000, stock: 16, imageUrl: "/cat_fragrances.png" },
    { name: "Eau de Parfum 'Boss'", category: "Fragancias", brand: "HUGO BOSS", costPrice: 48000, salePrice: 125000, stock: 18, imageUrl: "/cat_fragrances.png" },
    { name: "Fragancia 'Light Blue'", category: "Fragancias", brand: "DOLCE & GABBANA", costPrice: 58000, salePrice: 148000, stock: 15, imageUrl: "/cat_fragrances.png" },
    { name: "Body Mist Vainilla", category: "Fragancias", brand: "VICTORIA'S SECRET", costPrice: 12000, salePrice: 32000, stock: 35, imageUrl: "/cat_fragrances.png" },
    { name: "Perfume 'Le Male'", category: "Fragancias", brand: "JEAN PAUL GAULTIER", costPrice: 62000, salePrice: 158000, stock: 10, imageUrl: "/cat_fragrances.png" },
    { name: "Fragancia 'Eros'", category: "Fragancias", brand: "VERSACE", costPrice: 68000, salePrice: 172000, stock: 12, imageUrl: "/cat_fragrances.png" },
    { name: "Eau de Toilette Clásico", category: "Fragancias", brand: "ZARA", costPrice: 15000, salePrice: 39000, stock: 25, imageUrl: "/cat_fragrances.png" },
    { name: "Perfume 'Polo Blue'", category: "Fragancias", brand: "RALPH LAUREN", costPrice: 50000, salePrice: 130000, stock: 14, imageUrl: "/cat_fragrances.png" }
  ];

  let count = 0;
  for (const product of products) {
    await addDoc(collection(db, "products"), {
      ...product,
      isVIPOnly: Math.random() > 0.8, // 20% chance to be VIP only
      createdAt: new Date(),
      updatedAt: new Date()
    });
    count++;
  }
  return count;
};
