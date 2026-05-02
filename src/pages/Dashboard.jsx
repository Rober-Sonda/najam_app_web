import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Package, DollarSign, Bell, Plus, Edit2, Trash2, ShoppingCart, BookOpen, Check, X, Tags, Award } from 'lucide-react';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Product Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('');
  const [productBrandFilter, setProductBrandFilter] = useState('');
  const [productSort, setProductSort] = useState('newest');
  const [productSubcatFilter, setProductSubcatFilter] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Indumentaria',
    brand: '',
    subcategories: [],
    costPrice: '',
    salePrice: '',
    imageUrl: '',
    stock: '',
    isVIPOnly: false
  });

  // Transaction Form State
  const [showTxForm, setShowTxForm] = useState(false);
  const [txFormData, setTxFormData] = useState({
    type: 'Ingreso',
    amount: '',
    description: ''
  });

  // Category Form State
  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [catFormData, setCatFormData] = useState({
    name: '',
    options: '',
    subcategories: '' // comma separated string
  });

  // Brand Form State
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [brandFormData, setBrandFormData] = useState({
    name: '',
    linkedCategories: [] // array of category names
  });

  const user = useStore(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    } else {
      fetchData();
    }
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchTransactions(),
        fetchCategories(),
        fetchBrands()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchOrders = async () => {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by date descending
    ordersData.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
    setOrders(ordersData);
  };

  const fetchTransactions = async () => {
    const querySnapshot = await getDocs(collection(db, "transactions"));
    const txData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by date descending
    txData.sort((a, b) => b.date?.toMillis() - a.date?.toMillis());
    setTransactions(txData);
  };

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, "categories"));
    let docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    if (docs.length === 0) {
      // Seed defaults
      const defaults = [
        { name: "Indumentaria", options: "S, M, L, XL" },
        { name: "Fragancias", options: "50ml, 100ml" },
        { name: "Accesorios & Relojes", options: "" },
        { name: "Calzado", options: "38, 39, 40, 41, 42, 43" }
      ];
      for (const cat of defaults) {
        await addDoc(collection(db, "categories"), cat);
      }
      const newSnapshot = await getDocs(collection(db, "categories"));
      docs = newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    setCategories(docs);
  };

  const fetchBrands = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "brands"));
      setBrands(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching brands", error);
      // Fails silently if missing permissions, allows graceful degradation
    }
  };

  /* --- PRODUCT MANAGEMENT --- */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'category') {
      // Reset subcategories when category changes
      setFormData(prev => ({ ...prev, [name]: value, subcategories: [] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubcategoryToggle = (sub) => {
    setFormData(prev => {
      const subs = prev.subcategories || [];
      if (subs.includes(sub)) {
        return { ...prev, subcategories: subs.filter(s => s !== sub) };
      } else {
        return { ...prev, subcategories: [...subs, sub] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        subcategories: formData.subcategories || [],
        costPrice: Number(formData.costPrice),
        salePrice: Number(formData.salePrice),
        imageUrl: formData.imageUrl,
        stock: Number(formData.stock),
        isVIPOnly: formData.isVIPOnly,
        updatedAt: new Date()
      };

      if (editingId) {
        await updateDoc(doc(db, "products", editingId), productData);
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: new Date()
        });
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', category: 'Indumentaria', brand: '', subcategories: [], costPrice: '', salePrice: '', imageUrl: '', stock: '', isVIPOnly: false });
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      brand: product.brand || '',
      subcategories: product.subcategories || [],
      costPrice: product.costPrice,
      salePrice: product.salePrice,
      imageUrl: product.imageUrl || '',
      stock: product.stock || 0,
      isVIPOnly: product.isVIPOnly || false
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  /* --- ORDER MANAGEMENT --- */
  const handleOrderStatusChange = async (orderId, currentStatus, newStatus, totalAmount, customerName) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus, updatedAt: new Date() });
      
      // If marked as Delivered, automatically create an Income transaction
      if (newStatus === 'Entregado' && currentStatus !== 'Entregado') {
        await addDoc(collection(db, "transactions"), {
          type: 'Ingreso',
          amount: totalAmount,
          description: `Venta - Pedido de ${customerName}`,
          orderId: orderId,
          date: new Date()
        });
        alert("Pedido marcado como Entregado. Se ha registrado el ingreso en la Caja automáticamente.");
        fetchTransactions(); // refresh transactions
      }
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este pedido? Esta acción no se puede deshacer.")) {
      try {
        await deleteDoc(doc(db, "orders", id));
        fetchOrders();
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  /* --- TRANSACTION MANAGEMENT --- */
  const handleTxInputChange = (e) => {
    const { name, value } = e.target;
    setTxFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTxSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "transactions"), {
        type: txFormData.type,
        amount: Number(txFormData.amount),
        description: txFormData.description,
        date: new Date()
      });
      setShowTxForm(false);
      setTxFormData({ type: 'Ingreso', amount: '', description: '' });
      fetchTransactions();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleDeleteTx = async (id) => {
    if (window.confirm("¿Eliminar este movimiento de la caja?")) {
      try {
        await deleteDoc(doc(db, "transactions", id));
        fetchTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  /* --- CATEGORY MANAGEMENT --- */
  const handleCatInputChange = (e) => {
    const { name, value } = e.target;
    setCatFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    try {
      const catData = {
        name: catFormData.name,
        options: catFormData.options,
        subcategories: catFormData.subcategories,
      };
      
      if (editingCatId) {
        await updateDoc(doc(db, "categories", editingCatId), catData);
      } else {
        await addDoc(collection(db, "categories"), catData);
      }
      
      setShowCatForm(false);
      setEditingCatId(null);
      setCatFormData({ name: '', options: '', subcategories: '' });
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEditCat = (cat) => {
    setCatFormData({
      name: cat.name,
      options: cat.options || '',
      subcategories: cat.subcategories || ''
    });
    setEditingCatId(cat.id);
    setShowCatForm(true);
  };

  const handleDeleteCat = async (id) => {
    if (window.confirm("¿Eliminar esta categoría?")) {
      try {
        await deleteDoc(doc(db, "categories", id));
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  /* --- BRAND MANAGEMENT --- */
  const handleBrandInputChange = (e) => {
    const { name, value } = e.target;
    setBrandFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBrandCatToggle = (catName) => {
    setBrandFormData(prev => {
      const current = prev.linkedCategories;
      if (current.includes(catName)) {
        return { ...prev, linkedCategories: current.filter(c => c !== catName) };
      } else {
        return { ...prev, linkedCategories: [...current, catName] };
      }
    });
  };

  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    try {
      const brandData = {
        name: brandFormData.name,
        linkedCategories: brandFormData.linkedCategories,
      };

      if (editingBrandId) {
        await updateDoc(doc(db, "brands", editingBrandId), brandData);
      } else {
        await addDoc(collection(db, "brands"), brandData);
      }
      
      setShowBrandForm(false);
      setEditingBrandId(null);
      setBrandFormData({ name: '', linkedCategories: [] });
      fetchBrands();
    } catch (error) {
      console.error("Error saving brand:", error);
    }
  };

  const handleEditBrand = (brand) => {
    setBrandFormData({
      name: brand.name,
      linkedCategories: brand.linkedCategories || []
    });
    setEditingBrandId(brand.id);
    setShowBrandForm(true);
  };

  const handleDeleteBrand = async (id) => {
    if (window.confirm("¿Eliminar esta marca?")) {
      try {
        await deleteDoc(doc(db, "brands", id));
        fetchBrands();
      } catch (error) {
        console.error("Error deleting brand:", error);
      }
    }
  };

  /* --- SEED DEMO DATA --- */
  const handleSeedData = async () => {
    if (!window.confirm("¿Estás seguro de inyectar 60 productos masivos?")) return;
    setLoading(true);
    try {
      const { seedDatabase } = await import('../utils/seedData.js');
      const count = await seedDatabase(db);
      alert(`¡Inyección completada! Se agregaron ${count} productos exitosamente.`);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al inyectar los datos.");
    } finally {
      setLoading(false);
    }
  };

  // Finance calculations
  const totalCostValue = products.reduce((acc, p) => acc + (p.costPrice * (p.stock || 1)), 0);
  const totalSaleValue = products.reduce((acc, p) => acc + (p.salePrice * (p.stock || 1)), 0);
  const potentialProfit = totalSaleValue - totalCostValue;

  const totalIngresos = transactions.filter(t => t.type === 'Ingreso').reduce((acc, t) => acc + t.amount, 0);
  const totalEgresos = transactions.filter(t => t.type === 'Egreso').reduce((acc, t) => acc + t.amount, 0);
  const balanceActual = totalIngresos - totalEgresos;

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase());
    const matchCategory = productCategoryFilter ? p.category === productCategoryFilter : true;
    const matchBrand = productBrandFilter ? p.brand === productBrandFilter : true;
    const matchSubcat = productSubcatFilter ? (p.subcategories && p.subcategories.includes(productSubcatFilter)) : true;
    return matchSearch && matchCategory && matchBrand && matchSubcat;
  }).sort((a, b) => {
    if (productSort === 'price_asc') return a.salePrice - b.salePrice;
    if (productSort === 'price_desc') return b.salePrice - a.salePrice;
    if (productSort === 'name_asc') return a.name.localeCompare(b.name);
    return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0); // newest
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar glass-panel">
        <div className="admin-profile">
          <img src={user?.photoURL} alt="Admin" className="admin-avatar" />
          <p className="admin-name">{user?.displayName}</p>
          <span className="admin-badge">Administrador</span>
        </div>
        
        <nav className="dashboard-nav">
          <button className={`nav-tab ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <Package size={20} /> Catálogo
          </button>
          <button className={`nav-tab ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
            <Tags size={20} /> Categorías
          </button>
          <button className={`nav-tab ${activeTab === 'brands' ? 'active' : ''}`} onClick={() => setActiveTab('brands')}>
            <Award size={20} /> Marcas
          </button>
          <button className={`nav-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <ShoppingCart size={20} /> Pedidos
          </button>
          <button className={`nav-tab ${activeTab === 'ledger' ? 'active' : ''}`} onClick={() => setActiveTab('ledger')}>
            <BookOpen size={20} /> Caja
          </button>
          <button className={`nav-tab ${activeTab === 'finances' ? 'active' : ''}`} onClick={() => setActiveTab('finances')}>
            <DollarSign size={20} /> Métricas
          </button>
        </nav>
      </div>

      <div className="dashboard-content">
        {/* --- PRODUCT TAB --- */}
        {activeTab === 'products' && (
          <div className="tab-section animate-fade-in">
            <div className="section-header">
              <h2>Gestión de Catálogo</h2>
              <div style={{display:'flex', gap:'0.5rem'}}>
                <button className="add-btn" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
                  {showForm ? 'Cancelar' : <><Plus size={18}/> Nuevo Producto</>}
                </button>
                <button className="add-btn" style={{backgroundColor: '#ff9900', color: '#000'}} onClick={handleSeedData}>
                  Cargar 60 de Prueba
                </button>
              </div>
            </div>

            {showForm && (
              <form className="product-form glass-panel" onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre del Producto</label>
                    <input type="text" name="name" className="input-field" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Categoría</label>
                    <select name="category" className="input-field" value={formData.category} onChange={handleInputChange}>
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                      {categories.length === 0 && <option value="Indumentaria">Indumentaria (Por defecto)</option>}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Marca</label>
                    <select name="brand" className="input-field" value={formData.brand} onChange={handleInputChange}>
                      <option value="">-- Sin Marca --</option>
                      {brands
                        .filter(b => b.linkedCategories.length === 0 || b.linkedCategories.includes(formData.category))
                        .map(b => (
                          <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Precio de Costo ($)</label>
                    <input type="number" name="costPrice" className="input-field" value={formData.costPrice} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Precio de Venta ($)</label>
                    <input type="number" name="salePrice" className="input-field" value={formData.salePrice} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>URL de Imagen (Opcional)</label>
                    <input type="text" name="imageUrl" className="input-field" value={formData.imageUrl} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input type="number" name="stock" className="input-field" value={formData.stock} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" name="isVIPOnly" id="isVIPOnly" checked={formData.isVIPOnly} onChange={handleInputChange} />
                    <label htmlFor="isVIPOnly" style={{color: '#ff3333', fontWeight: 'bold'}}>Solo para VIP (Najam Black)</label>
                  </div>
                </div>

                {/* Subcategories Checkboxes */}
                {(() => {
                  const selectedCat = categories.find(c => c.name === formData.category);
                  if (selectedCat && selectedCat.subcategories && selectedCat.subcategories.trim() !== '') {
                    const subs = selectedCat.subcategories.split(',').map(s => s.trim()).filter(Boolean);
                    if (subs.length > 0) {
                      return (
                        <div className="form-group" style={{marginTop: '1rem'}}>
                          <label>Atributos / Subcategorías (Opcional)</label>
                          <div style={{display:'flex', gap:'1rem', flexWrap:'wrap', marginTop:'0.5rem'}}>
                            {subs.map(sub => (
                              <label key={sub} style={{display:'flex', alignItems:'center', gap:'0.2rem', cursor:'pointer'}}>
                                <input 
                                  type="checkbox" 
                                  checked={formData.subcategories && formData.subcategories.includes(sub)}
                                  onChange={() => handleSubcategoryToggle(sub)}
                                />
                                {sub}
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  }
                  return null;
                })()}

                <button type="submit" className="save-btn" style={{marginTop: '1rem'}}>{editingId ? 'Actualizar Producto' : 'Guardar Producto'}</button>
              </form>
            )}

            {!loading && (
              <div className="filters-bar glass-panel" style={{display:'flex', gap:'1rem', marginBottom:'1rem', padding:'1rem', flexWrap:'wrap', alignItems:'center'}}>
                <input 
                  type="text" 
                  placeholder="Buscar producto por nombre..." 
                  className="input-field" 
                  style={{flex:'1', minWidth:'200px', margin:0}}
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
                <select 
                  className="input-field" 
                  style={{width:'auto', margin:0}}
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                >
                  <option value="">Todas las Categorías</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <select 
                  className="input-field" 
                  style={{width:'auto', margin:0}}
                  value={productBrandFilter}
                  onChange={(e) => setProductBrandFilter(e.target.value)}
                >
                  <option value="">Todas las Marcas</option>
                  {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                </select>
                {productCategoryFilter && (() => {
                  const selectedCat = categories.find(c => c.name === productCategoryFilter);
                  if (selectedCat && selectedCat.subcategories) {
                    const subs = selectedCat.subcategories.split(',').map(s => s.trim()).filter(Boolean);
                    if (subs.length > 0) {
                      return (
                        <select 
                          className="input-field" 
                          style={{width:'auto', margin:0}}
                          value={productSubcatFilter}
                          onChange={(e) => setProductSubcatFilter(e.target.value)}
                        >
                          <option value="">Todas las Subcategorías</option>
                          {subs.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      );
                    }
                  }
                  return null;
                })()}
                <select 
                  className="input-field" 
                  style={{width:'auto', margin:0}}
                  value={productSort}
                  onChange={(e) => setProductSort(e.target.value)}
                >
                  <option value="newest">Más Nuevos</option>
                  <option value="price_asc">Menor Precio</option>
                  <option value="price_desc">Mayor Precio</option>
                  <option value="name_asc">A-Z</option>
                </select>
              </div>
            )}

            {loading ? (
              <p>Cargando catálogo...</p>
            ) : (
              <div className="table-container glass-panel">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Costo</th>
                      <th>Venta</th>
                      <th>Stock</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr key={p.id}>
                        <td data-label="Producto">
                          {p.brand && <small style={{display:'block', color:'#888'}}>{p.brand}</small>}
                          {p.name} 
                          {p.isVIPOnly && <span className="vip-badge">VIP</span>}
                        </td>
                        <td data-label="Categoría">{p.category}</td>
                        <td data-label="Costo">${p.costPrice}</td>
                        <td data-label="Venta">${p.salePrice}</td>
                        <td data-label="Stock">{p.stock}</td>
                        <td data-label="Acciones" className="actions-cell">
                          <button onClick={() => handleEdit(p)} className="icon-btn edit"><Edit2 size={16}/></button>
                          <button onClick={() => handleDelete(p.id)} className="icon-btn delete" title="Eliminar"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr><td colSpan="6" className="empty-table-msg">No se encontraron productos.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- ORDERS TAB --- */}
        {activeTab === 'orders' && (
          <div className="tab-section animate-fade-in">
            <div className="section-header">
              <h2>Gestión de Pedidos</h2>
            </div>
            {loading ? (
              <p>Cargando pedidos...</p>
            ) : (
              <div className="table-container glass-panel">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td data-label="Cliente">
                          {o.customerName} <br/>
                          <small style={{color: '#888'}}>{new Date(o.createdAt?.toDate()).toLocaleDateString()}</small>
                        </td>
                        <td data-label="Items">
                          <ul style={{listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem'}}>
                            {o.items?.map((item, idx) => (
                              <li key={idx}>
                                {item.quantity}x {item.name} 
                                {item.size && item.size !== 'Único' ? ` (${item.size})` : ''}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td data-label="Total">${o.totalAmount}</td>
                        <td data-label="Estado">
                          <select 
                            className={`status-select ${o.status?.toLowerCase().replace(' ', '-')}`}
                            value={o.status}
                            onChange={(e) => handleOrderStatusChange(o.id, o.status, e.target.value, o.totalAmount, o.customerName)}
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Preparación">En Preparación</option>
                            <option value="Entregado">Entregado</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>
                        </td>
                        <td data-label="Acciones" className="actions-cell">
                          <button onClick={() => handleDeleteOrder(o.id)} className="icon-btn delete" title="Eliminar Pedido"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan="5" className="empty-table-msg">No hay pedidos registrados.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- LEDGER TAB --- */}
        {activeTab === 'ledger' && (
          <div className="tab-section animate-fade-in">
            <div className="section-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <h2>Caja</h2>
              <button className="add-btn" onClick={() => setShowTxForm(!showTxForm)}>
                {showTxForm ? 'Cancelar' : <><Plus size={18}/> Nuevo Movimiento</>}
              </button>
            </div>

            {showTxForm && (
              <form className="product-form glass-panel" onSubmit={handleTxSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Tipo de Movimiento</label>
                    <select name="type" className="input-field" value={txFormData.type} onChange={handleTxInputChange}>
                      <option value="Ingreso">Ingreso</option>
                      <option value="Egreso">Egreso</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Monto ($)</label>
                    <input type="number" name="amount" className="input-field" value={txFormData.amount} onChange={handleTxInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <input type="text" name="description" className="input-field" value={txFormData.description} onChange={handleTxInputChange} required placeholder="Ej. Pago de luz, Venta efectivo..." />
                  </div>
                </div>
                <button type="submit" className="save-btn" style={{backgroundColor: txFormData.type === 'Ingreso' ? 'var(--success-color)' : 'var(--error-color)'}}>Registrar {txFormData.type}</button>
              </form>
            )}

            {/* BALANCE CARDS */}
            <div className="metrics-grid" style={{marginBottom: '2rem'}}>
              <div className="metric-card glass-panel" style={{padding: '1.5rem'}}>
                <h3>Ingresos</h3>
                <p className="metric-value" style={{color: 'var(--success-color)'}}>${totalIngresos.toLocaleString()}</p>
              </div>
              <div className="metric-card glass-panel" style={{padding: '1.5rem'}}>
                <h3>Egresos</h3>
                <p className="metric-value" style={{color: 'var(--error-color)'}}>${totalEgresos.toLocaleString()}</p>
              </div>
              <div className="metric-card glass-panel highlight" style={{padding: '1.5rem'}}>
                <h3>Balance Actual</h3>
                <p className="metric-value">${balanceActual.toLocaleString()}</p>
              </div>
            </div>


            {loading ? (
              <p>Cargando movimientos...</p>
            ) : (
              <div className="table-container glass-panel">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Descripción</th>
                      <th>Monto</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx => (
                      <tr key={tx.id}>
                        <td data-label="Fecha">{tx.date ? new Date(tx.date.toDate()).toLocaleDateString() : 'N/A'}</td>
                        <td data-label="Descripción">
                          {tx.type === 'Ingreso' ? <span style={{color: 'var(--success-color)', marginRight:'0.5rem'}}>+</span> : <span style={{color: 'var(--error-color)', marginRight:'0.5rem'}}>-</span>}
                          {tx.description}
                        </td>
                        <td data-label="Monto" style={{color: tx.type === 'Ingreso' ? 'var(--success-color)' : 'var(--error-color)', fontWeight: 'bold'}}>
                          ${tx.amount}
                        </td>
                        <td data-label="Acciones" className="actions-cell">
                          <button onClick={() => handleDeleteTx(tx.id)} className="icon-btn delete" title="Eliminar Movimiento"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr><td colSpan="4" className="empty-table-msg">No hay movimientos registrados.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- METRICS TAB --- */}
        {activeTab === 'finances' && (
          <div className="tab-section animate-fade-in">
            <div className="section-header">
              <h2>Métricas de Inventario (Proyección)</h2>
            </div>
            <div className="metrics-grid">
              <div className="metric-card glass-panel">
                <h3>Valor Total de Costo (Inventario Actual)</h3>
                <p className="metric-value">${totalCostValue.toLocaleString()}</p>
              </div>
              <div className="metric-card glass-panel">
                <h3>Valor Total de Venta (Inventario Actual)</h3>
                <p className="metric-value">${totalSaleValue.toLocaleString()}</p>
              </div>
              <div className="metric-card glass-panel highlight">
                <h3>Ganancia Potencial Estimada</h3>
                <p className="metric-value success">${potentialProfit.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* --- CATEGORIES TAB --- */}
        {activeTab === 'categories' && (
          <div className="tab-section animate-fade-in">
            <div className="section-header">
              <h2>Administrar Categorías</h2>
              <button className="add-btn" onClick={() => { setShowCatForm(!showCatForm); setEditingCatId(null); setCatFormData({name:'', options:'', subcategories:''}); }}>
                {showCatForm ? 'Cancelar' : <><Plus size={18}/> Nueva Categoría</>}
              </button>
            </div>

            {showCatForm && (
              <form className="product-form glass-panel" onSubmit={handleCatSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre de Categoría</label>
                    <input type="text" name="name" className="input-field" value={catFormData.name} onChange={handleCatInputChange} required placeholder="Ej. Remeras, Perfumes, Gorras" />
                  </div>
                  <div className="form-group">
                    <label>Opciones Disponibles (Separadas por comas)</label>
                    <input type="text" name="options" className="input-field" value={catFormData.options} onChange={handleCatInputChange} placeholder="Ej. S, M, L, XL  o  50ml, 100ml" />
                  </div>
                  <div className="form-group" style={{gridColumn: '1 / -1'}}>
                    <label>Subcategorías / Atributos / Filtros (Separados por coma)</label>
                    <input type="text" name="subcategories" className="input-field" value={catFormData.subcategories} onChange={handleCatInputChange} placeholder="Ej. Verano, Invierno, Algodón, Cuero, Rojo, Azul" />
                    <small style={{color: '#888'}}>Estas etiquetas aparecerán como filtros dinámicos (colores, estaciones, materiales) en la tienda.</small>
                  </div>
                </div>
                <button type="submit" className="save-btn">{editingCatId ? 'Actualizar Categoría' : 'Guardar Categoría'}</button>
              </form>
            )}

            {loading ? (
              <p>Cargando categorías...</p>
            ) : (
              <div className="table-container glass-panel">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Opciones / Variantes</th>
                      <th>Subcategorías / Atributos</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(c => (
                      <tr key={c.id}>
                        <td data-label="Nombre"><strong>{c.name}</strong></td>
                        <td data-label="Opciones">
                          {c.options ? c.options.split(',').map(o => <span key={o} className="cat-chip">{o.trim()}</span>) : <span style={{color: '#888'}}>Tamaño Único</span>}
                        </td>
                        <td data-label="Subcategorías">
                          {c.subcategories ? c.subcategories.split(',').map(s => <span key={s} className="cat-chip" style={{background:'var(--accent-color)', color:'var(--bg-color)'}}>{s.trim()}</span>) : <span style={{color: '#888'}}>-</span>}
                        </td>
                        <td data-label="Acciones" className="actions-cell">
                          <button onClick={() => handleEditCat(c)} className="icon-btn edit" title="Editar Categoría"><Edit2 size={16}/></button>
                          <button onClick={() => handleDeleteCat(c.id)} className="icon-btn delete" title="Eliminar Categoría"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr><td colSpan="4" className="empty-table-msg">No hay categorías. Crea una nueva para empezar.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- BRANDS TAB --- */}
        {activeTab === 'brands' && (
          <div className="tab-section animate-fade-in">
            <div className="section-header">
              <h2>Administrar Marcas</h2>
              <button className="add-btn" onClick={() => { setShowBrandForm(!showBrandForm); setEditingBrandId(null); setBrandFormData({name:'', linkedCategories:[]}); }}>
                {showBrandForm ? 'Cancelar' : <><Plus size={18}/> Nueva Marca</>}
              </button>
            </div>

            {showBrandForm && (
              <form className="product-form glass-panel" onSubmit={handleBrandSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre de la Marca</label>
                    <input type="text" name="name" className="input-field" value={brandFormData.name} onChange={handleBrandInputChange} required placeholder="Ej. Nike, Zara" />
                  </div>
                  <div className="form-group">
                    <label>Vincular a Categorías (Opcional)</label>
                    <div style={{display:'flex', gap:'1rem', flexWrap:'wrap', marginTop:'0.5rem'}}>
                      {categories.map(c => (
                        <label key={c.id} style={{display:'flex', alignItems:'center', gap:'0.2rem', cursor:'pointer'}}>
                          <input 
                            type="checkbox" 
                            checked={brandFormData.linkedCategories.includes(c.name)}
                            onChange={() => handleBrandCatToggle(c.name)}
                          />
                          {c.name}
                        </label>
                      ))}
                    </div>
                    <small style={{color:'#888', display:'block', marginTop:'0.5rem'}}>Si no seleccionas ninguna, la marca estará disponible para todas las categorías.</small>
                  </div>
                </div>
                <button type="submit" className="save-btn">{editingBrandId ? 'Actualizar Marca' : 'Guardar Marca'}</button>
              </form>
            )}

            {loading ? (
              <p>Cargando marcas...</p>
            ) : (
              <div className="table-container glass-panel">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Marca</th>
                      <th>Categorías Vinculadas</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brands.map(b => (
                      <tr key={b.id}>
                        <td data-label="Marca"><strong>{b.name}</strong></td>
                        <td data-label="Categorías">
                          {b.linkedCategories && b.linkedCategories.length > 0 
                            ? b.linkedCategories.join(', ') 
                            : <span style={{color:'#888'}}>Todas</span>}
                        </td>
                        <td data-label="Acciones" className="actions-cell">
                          <button onClick={() => handleEditBrand(b)} className="icon-btn edit" title="Editar Marca"><Edit2 size={16}/></button>
                          <button onClick={() => handleDeleteBrand(b.id)} className="icon-btn delete" title="Eliminar Marca"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                    {brands.length === 0 && (
                      <tr><td colSpan="3" className="empty-table-msg">No hay marcas registradas.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
