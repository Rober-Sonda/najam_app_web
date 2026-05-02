import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase';
import useStore from '../store/useStore';
import { ShoppingCart, X, Filter, Search, SlidersHorizontal, ArrowDownUp } from 'lucide-react';
import { collection as firestoreCollection, getDocs as getFirestoreDocs } from 'firebase/firestore';
import './Shop.css';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortFilter, setSortFilter] = useState('newest');
  const [subcatFilters, setSubcatFilters] = useState([]); // array of selected subcats

  // Variant Modal State
  const [selectedVariantProduct, setSelectedVariantProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState('');
  
  const addToCart = useStore(state => state.addToCart);
  const user = useStore(state => state.user);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Categories
        const catSnapshot = await getFirestoreDocs(firestoreCollection(db, "categories"));
        const catData = catSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(catData);

        // Fetch Brands
        try {
          const brandSnapshot = await getFirestoreDocs(firestoreCollection(db, "brands"));
          setBrands(brandSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (e) {
          console.warn("Brands not fetchable", e);
        }

        // Fetch Products
        const querySnapshot = await getFirestoreDocs(firestoreCollection(db, "products"));
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (productsData.length > 0) {
          setProducts(productsData);
        } else {
          // Fallback demo data if DB is empty
          setProducts([
            { id: '1', name: "Remera Oversize Black Label", category: "Indumentaria", costPrice: 5000, salePrice: 15000, stock: 20, isVIPOnly: false, imageUrl: "/cat_apparel.png" },
            { id: '2', name: "Buzo Hoodie 'Noches de Ciudad'", category: "Indumentaria", costPrice: 12000, salePrice: 35000, stock: 15, isVIPOnly: true, imageUrl: "/cat_apparel.png" },
            { id: '3', name: "Zapatillas Urban High-Top", category: "Calzado", costPrice: 25000, salePrice: 65000, stock: 10, isVIPOnly: false, imageUrl: "/cat_shoes.png" },
            { id: '4', name: "Reloj Minimalista Onyx", category: "Accesorios", costPrice: 15000, salePrice: 45000, stock: 5, isVIPOnly: true, imageUrl: "/cat_accessories.png" },
            { id: '5', name: "Perfume 'Esencia 9 de Julio'", category: "Fragancias", costPrice: 8000, salePrice: 28000, stock: 30, isVIPOnly: false, imageUrl: "/cat_fragrances.png" }
          ]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle Category Change
  const handleCategoryChange = (catName) => {
    setSearchParams(catName === "Todos" ? {} : { category: catName.toLowerCase() });
    setSubcatFilters([]); // Reset subcats when category changes
  };

  const handleSubcatToggle = (sub) => {
    if (subcatFilters.includes(sub)) {
      setSubcatFilters(subcatFilters.filter(s => s !== sub));
    } else {
      setSubcatFilters([...subcatFilters, sub]);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchCat = categoryFilter ? p.category?.toLowerCase() === categoryFilter.toLowerCase() : true;
    const matchSearch = searchFilter ? p.name.toLowerCase().includes(searchFilter.toLowerCase()) : true;
    const matchBrand = brandFilter ? p.brand === brandFilter : true;
    const matchMin = minPrice ? p.salePrice >= Number(minPrice) : true;
    const matchMax = maxPrice ? p.salePrice <= Number(maxPrice) : true;
    // Subcategories logic: if filters are selected, product MUST have AT LEAST ONE of the selected subcategories (OR logic), or ALL (AND logic)? 
    // Usually it's OR logic within the same filter type.
    const matchSubcats = subcatFilters.length > 0 
      ? (p.subcategories && subcatFilters.some(sub => p.subcategories.includes(sub)))
      : true;

    return matchCat && matchSearch && matchBrand && matchMin && matchMax && matchSubcats;
  }).sort((a, b) => {
    if (sortFilter === 'price_asc') return a.salePrice - b.salePrice;
    if (sortFilter === 'price_desc') return b.salePrice - a.salePrice;
    if (sortFilter === 'name_asc') return a.name.localeCompare(b.name);
    return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0); // newest default
  });

  const handleAddToCartClick = (product) => {
    if (!user) {
      alert("Debes iniciar sesión con Google para agregar al carrito.");
      return;
    }
    
    // Check if product's category has variants
    const cat = categories.find(c => c.name === product.category);
    if (cat && cat.options && cat.options.trim() !== '') {
      setSelectedVariantProduct(product);
      setSelectedVariant(''); // reset
    } else {
      // No variants, add directly
      addToCart({ ...product, size: 'Único' });
    }
  };

  const confirmAddToCart = () => {
    if (!selectedVariant) {
      alert("Por favor selecciona una opción.");
      return;
    }
    addToCart({ ...selectedVariantProduct, size: selectedVariant });
    setSelectedVariantProduct(null);
    setSelectedVariant('');
  };

  const filterList = ["Todos", ...categories.map(c => c.name)];
  if (categories.length === 0) {
    // Fallback
    filterList.push("Indumentaria", "Calzado", "Accesorios & Relojes", "Fragancias");
  }

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>Catálogo</h1>
        <p>Descubre la colección completa de NAJAM.</p>
      </div>

      <div className="shop-layout">
        <aside className={`shop-sidebar glass-panel ${showFilters ? 'mobile-show' : 'mobile-hide'}`}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
            <h3 style={{margin:0, display:'flex', alignItems:'center', gap:'0.5rem'}}><SlidersHorizontal size={20}/> Filtros</h3>
            {showFilters && <button onClick={() => setShowFilters(false)} style={{background:'none', border:'none', color:'var(--text-primary)'}}><X size={20}/></button>}
          </div>

          <div className="filter-group" style={{marginBottom: '1.5rem'}}>
            <h4 style={{marginBottom: '0.8rem', fontSize:'0.9rem', color:'var(--text-secondary)'}}>Categorías</h4>
            <ul className="category-filters">
              {filterList.map(cat => (
                <li key={cat}>
                  <button 
                    className={`filter-btn ${(!categoryFilter && cat === "Todos") || (categoryFilter?.toLowerCase() === cat.toLowerCase()) ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {categoryFilter && (() => {
            const catObj = categories.find(c => c.name.toLowerCase() === categoryFilter.toLowerCase());
            if (catObj && catObj.subcategories) {
              const subs = catObj.subcategories.split(',').map(s => s.trim()).filter(Boolean);
              if (subs.length > 0) {
                return (
                  <div className="filter-group" style={{marginBottom: '1.5rem'}}>
                    <h4 style={{marginBottom: '0.8rem', fontSize:'0.9rem', color:'var(--text-secondary)'}}>Subcategorías / Atributos</h4>
                    <div style={{display:'flex', flexWrap:'wrap', gap:'0.5rem'}}>
                      {subs.map(sub => (
                        <button
                          key={sub}
                          onClick={() => handleSubcatToggle(sub)}
                          style={{
                            padding: '0.4rem 0.8rem', borderRadius:'20px', fontSize:'0.8rem', cursor:'pointer',
                            background: subcatFilters.includes(sub) ? 'var(--accent-color)' : 'transparent',
                            color: subcatFilters.includes(sub) ? 'var(--bg-color)' : 'var(--text-primary)',
                            border: `1px solid ${subcatFilters.includes(sub) ? 'var(--accent-color)' : 'var(--border-color)'}`
                          }}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }
            }
            return null;
          })()}

          <div className="filter-group" style={{marginBottom: '1.5rem'}}>
            <h4 style={{marginBottom: '0.8rem', fontSize:'0.9rem', color:'var(--text-secondary)'}}>Marcas</h4>
            <select 
              style={{width:'100%', padding:'0.8rem', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-color)', color:'var(--text-primary)', borderRadius:'8px'}}
              value={brandFilter} onChange={e => setBrandFilter(e.target.value)}
            >
              <option value="">Todas las Marcas</option>
              {brands.filter(b => !categoryFilter || b.linkedCategories.length === 0 || b.linkedCategories.map(c=>c.toLowerCase()).includes(categoryFilter.toLowerCase())).map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group" style={{marginBottom: '1.5rem'}}>
            <h4 style={{marginBottom: '0.8rem', fontSize:'0.9rem', color:'var(--text-secondary)'}}>Rango de Precio</h4>
            <div style={{display:'flex', gap:'0.5rem'}}>
              <input type="number" placeholder="Min $" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{width:'50%', padding:'0.6rem', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-color)', color:'var(--text-primary)', borderRadius:'8px'}} />
              <input type="number" placeholder="Max $" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{width:'50%', padding:'0.6rem', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-color)', color:'var(--text-primary)', borderRadius:'8px'}} />
            </div>
          </div>
        </aside>

        <div className="shop-content">
          <div className="shop-toolbar glass-panel" style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem', marginBottom:'1.5rem', borderRadius:'12px', flexWrap:'wrap', gap:'1rem'}}>
            <div style={{display:'flex', gap:'1rem', alignItems:'center', flex:'1', minWidth:'250px'}}>
              <button 
                className="filter-toggle-btn"
                onClick={() => setShowFilters(!showFilters)}
                style={{display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.8rem 1.2rem', background:'var(--accent-color)', color:'var(--bg-color)', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}
              >
                <Filter size={18}/> Filtros
              </button>
              
              <div style={{position:'relative', flex:'1'}}>
                <Search size={18} style={{position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', color:'var(--text-secondary)'}}/>
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{width:'100%', padding:'0.8rem 1rem 0.8rem 2.5rem', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-color)', color:'var(--text-primary)', borderRadius:'8px'}}
                />
              </div>
            </div>

            <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
              <ArrowDownUp size={18} color="var(--text-secondary)"/>
              <select 
                value={sortFilter}
                onChange={e => setSortFilter(e.target.value)}
                style={{padding:'0.8rem', background:'transparent', border:'none', color:'var(--text-primary)', fontWeight:'bold', cursor:'pointer'}}
              >
                <option value="newest" style={{color:'#000'}}>Más Recientes</option>
                <option value="price_asc" style={{color:'#000'}}>Menor Precio</option>
                <option value="price_desc" style={{color:'#000'}}>Mayor Precio</option>
                <option value="name_asc" style={{color:'#000'}}>Alfabético A-Z</option>
              </select>
            </div>
          </div>

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
                    
                    {product.isVIPOnly && (
                      <div style={{position:'absolute', top:'10px', left:'10px', background:'#ff3333', color:'#fff', padding:'0.2rem 0.5rem', borderRadius:'4px', fontSize:'0.7rem', fontWeight:'bold', zIndex: 10}}>
                        NAJAM BLACK
                      </div>
                    )}

                    {product.isVIPOnly && !user?.isVIP ? (
                      <div className="vip-lock-overlay" style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#fff', zIndex: 5}}>
                        <span style={{fontSize:'2rem', marginBottom:'0.5rem'}}>🔒</span>
                        <span style={{fontWeight:'bold', letterSpacing:'0.1em'}}>SOLO VIP</span>
                      </div>
                    ) : (
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCartClick(product)}
                        title={user ? "Agregar al carrito" : "Inicia sesión para comprar"}
                      >
                        <ShoppingCart size={20} />
                      </button>
                    )}
                  </div>
                  <div className="product-info">
                    {product.brand && <span className="product-brand" style={{display:'block', fontSize:'0.75rem', fontWeight:'bold', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-secondary)', marginBottom:'0.2rem'}}>{product.brand}</span>}
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

      {/* VARIANT SELECTION MODAL */}
      {selectedVariantProduct && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{maxWidth: '400px', textAlign: 'center'}}>
            <button className="close-modal-btn" onClick={() => setSelectedVariantProduct(null)}><X size={24}/></button>
            <h2 style={{marginBottom: '0.5rem'}}>{selectedVariantProduct.name}</h2>
            <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem'}}>Selecciona la opción deseada:</p>
            
            <div className="variants-container" style={{display:'flex', gap:'0.5rem', flexWrap:'wrap', justifyContent:'center', marginBottom:'2rem'}}>
              {categories.find(c => c.name === selectedVariantProduct.category)?.options.split(',').map(opt => opt.trim()).map(opt => (
                <button 
                  key={opt}
                  className={`variant-btn ${selectedVariant === opt ? 'active' : ''}`}
                  onClick={() => setSelectedVariant(opt)}
                  style={{
                    padding: '0.5rem 1.5rem',
                    borderRadius: '4px',
                    border: `1px solid ${selectedVariant === opt ? 'var(--accent-color)' : 'var(--border-color)'}`,
                    background: selectedVariant === opt ? 'var(--accent-color)' : 'transparent',
                    color: selectedVariant === opt ? 'var(--bg-color)' : 'var(--text-primary)'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button className="save-btn" onClick={confirmAddToCart} disabled={!selectedVariant} style={{width: '100%'}}>
              Confirmar y Agregar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Shop;
