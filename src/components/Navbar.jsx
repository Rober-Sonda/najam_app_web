import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X, ShieldAlert } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import useStore from '../store/useStore';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useStore(state => state.user);
  const cart = useStore(state => state.cart);
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="navbar-container glass-panel">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">NAJAM</span>
        </Link>

        <nav className={`navbar-links ${isOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>Inicio</Link>
          <Link to="/shop" onClick={() => setIsOpen(false)}>Catálogo</Link>
          <Link to="/lookbook" onClick={() => setIsOpen(false)}>Lookbook</Link>
          <Link to="/brand" onClick={() => setIsOpen(false)}>La Marca</Link>
          
          {user && (
            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="dashboard-link">
              <ShieldAlert size={16} /> Admin
            </Link>
          )}

          <div className="nav-actions-mobile">
            {user ? (
              <>
                <button className="auth-btn" onClick={() => useStore.setState(state => ({ user: {...state.user, isVIP: !state.user.isVIP} }))}>
                  {user.isVIP ? 'VIP Activo' : 'Activar VIP'}
                </button>
                <button className="auth-btn" onClick={handleLogout}>
                  <LogOut size={18} /> Salir
                </button>
              </>
            ) : (
              <button className="auth-btn" onClick={handleLogin}>
                <User size={18} /> Ingresar
              </button>
            )}
          </div>
        </nav>

        <div className="navbar-actions">
          {user ? (
             <div className="user-profile">
               <img src={user.photoURL} alt="Profile" className="user-avatar" style={{border: user.isVIP ? '2px solid #ff3333' : '1px solid var(--border-color)'}} title={user.isVIP ? 'Miembro VIP' : 'Miembro Regular'} />
               <button className="auth-btn desktop-only" onClick={() => useStore.setState(state => ({ user: {...state.user, isVIP: !state.user.isVIP} }))} title="Alternar VIP (Demo)" style={{color: user.isVIP ? '#ff3333' : 'inherit'}}>
                 <ShieldAlert size={20} />
               </button>
               <button className="auth-btn desktop-only" onClick={handleLogout} title="Cerrar sesión">
                 <LogOut size={20} />
               </button>
             </div>
          ) : (
            <button className="auth-btn desktop-only" onClick={handleLogin} title="Iniciar sesión con Google">
              <User size={20} />
            </button>
          )}
          
          <Link to="/cart" className="cart-btn">
            <ShoppingBag size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
