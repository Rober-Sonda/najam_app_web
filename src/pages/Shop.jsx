import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/auth'; // Wait, it's firestore
import { db } from '../firebase';
import useStore from '../store/useStore';
import { ShoppingCart } from 'lucide-react';
import './Shop.css';

// Fix import
import { getDocs as getFirestoreDocs, collection as firestoreCollection } from 'firebase/firestore';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const addToCart = useStore(state => state.addToCart);
  const user = useStore(state => state.user);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getFirestoreDocs(firestoreCollection(db, "products"));
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = categoryFilter 
    ? products.filter(p => p.category?.toLowerCase() === categoryFilter.toLowerCase())
    : products;

  const handleAddToCart = (product) => {
    if (!user) {
      alert("Debes iniciar sesión con Google para agregar al carrito.");
      return;
    }
    addToCart({ ...product, size: 'Único' }); // Default size
  };

  const categories = ["Todos", "Indumentaria", "Calzado", "Accesorios", "Fragancias"];

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>Catálogo</h1>
        <p>Descubre la colección completa de NAJAM.</p>
      </div>

      <div className="shop-layout">
        <aside className="shop-sidebar glass-panel">
          <h3>Filtros</h3>
          <ul className="category-filters">
            {categories.map(cat => (
              <li key={cat}>
                <button 
                  className={`filter-btn ${(!categoryFilter && cat === "Todos") || (categoryFilter?.toLowerCase() === cat.toLowerCase()) ? 'active' : ''}`}
                  onClick={() => setSearchParams(cat === "Todos" ? {} : { category: cat.toLowerCase() })}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="shop-content">
          {loading ? (
            <div className="loading-spinner">Cargando colección...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state glass-panel">
              <p>No hay productos disponibles en esta categoría por el momento.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="product-image" />
                    ) : (
                      <div className="product-image-placeholder">NAJAM</div>
                    )}
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                      title={user ? "Agregar al carrito" : "Inicia sesión para comprar"}
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                  <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">${product.salePrice}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
