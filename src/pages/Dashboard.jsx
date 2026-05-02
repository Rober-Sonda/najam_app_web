import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Package, DollarSign, Bell, Plus, Edit2, Trash2 } from 'lucide-react';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Product Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Indumentaria',
    costPrice: '',
    salePrice: '',
    imageUrl: '',
    stock: '',
    isVIPOnly: false
  });

  const user = useStore(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    // Basic protection (in a real app, check a custom claim or specific admin emails)
    if (!user) {
      navigate('/');
    } else {
      fetchProducts();
    }
  }, [user, navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        category: formData.category,
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
      setFormData({ name: '', category: 'Indumentaria', costPrice: '', salePrice: '', imageUrl: '', stock: '', isVIPOnly: false });
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
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

  // Finance calculations
  const totalCostValue = products.reduce((acc, p) => acc + (p.costPrice * (p.stock || 1)), 0);
  const totalSaleValue = products.reduce((acc, p) => acc + (p.salePrice * (p.stock || 1)), 0);
  const potentialProfit = totalSaleValue - totalCostValue;

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar glass-panel">
        <div className="admin-profile">
          <img src={user?.photoURL} alt="Admin" className="admin-avatar" />
          <p className="admin-name">{user?.displayName}</p>
          <span className="admin-badge">Administrador</span>
        </div>
        
        <nav className="dashboard-nav">
          <button 
            className={`nav-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={20} /> Catálogo
          </button>
          <button 
            className={`nav-tab ${activeTab === 'finances' ? 'active' : ''}`}
            onClick={() => setActiveTab('finances')}
          >
            <DollarSign size={20} /> Finanzas
          </button>
          <button 
            className={`nav-tab ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            <Bell size={20} /> Anuncios
          </button>
        </nav>
      </div>

      <div className="dashboard-content">
        {activeTab === 'products' && (
          <div className="tab-section animate-fade-in">
            <div className="section-header">
              <h2>Gestión de Catálogo</h2>
              <button className="add-btn" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
                {showForm ? 'Cancelar' : <><Plus size={18}/> Nuevo Producto</>}
              </button>
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
                      <option value="Indumentaria">Indumentaria</option>
                      <option value="Calzado">Calzado</option>
                      <option value="Accesorios">Accesorios</option>
                      <option value="Fragancias">Fragancias</option>
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
                <button type="submit" className="save-btn">{editingId ? 'Actualizar Producto' : 'Crear Producto'}</button>
              </form>
            )}

            {loading ? (
              <p>Cargando productos...</p>
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
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>
                          {p.name} 
                          {p.isVIPOnly && <span style={{marginLeft: '0.5rem', backgroundColor: '#ff3333', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold'}}>VIP</span>}
                        </td>
                        <td>{p.category}</td>
                        <td>${p.costPrice}</td>
                        <td>${p.salePrice}</td>
                        <td>{p.stock}</td>
                        <td className="actions-cell">
                          <button onClick={() => handleEdit(p)} className="icon-btn edit"><Edit2 size={16}/></button>
                          <button onClick={() => handleDelete(p.id)} className="icon-btn delete"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No hay productos registrados.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'finances' && (
          <div className="tab-section animate-fade-in">
            <div className="section-header">
              <h2>Métricas Financieras</h2>
            </div>
            <div className="metrics-grid">
              <div className="metric-card glass-panel">
                <h3>Valor Total de Costo (Inventario)</h3>
                <p className="metric-value">${totalCostValue.toLocaleString()}</p>
              </div>
              <div className="metric-card glass-panel">
                <h3>Valor Total de Venta (Inventario)</h3>
                <p className="metric-value">${totalSaleValue.toLocaleString()}</p>
              </div>
              <div className="metric-card glass-panel highlight">
                <h3>Ganancia Potencial Estimada</h3>
                <p className="metric-value success">${potentialProfit.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="tab-section animate-fade-in">
            <div className="section-header">
              <h2>Centro de Anuncios</h2>
            </div>
            <div className="glass-panel" style={{padding: '2rem'}}>
              <p>Envía notificaciones push o banners a los usuarios registrados (En desarrollo).</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
