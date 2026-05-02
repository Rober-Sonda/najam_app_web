import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-subtitle">NUEVA COLECCIÓN</span><br/>
            DESTILA<br/>ORIGINALIDAD
          </h1>
          <p className="hero-text">Glamour y tendencia en cada detalle. Descubre el estilo que te define.</p>
          <Link to="/shop" className="hero-btn">
            Explorar Colección <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Categorías Destacadas */}
      <section className="featured-categories">
        <h2 className="section-title">Elige tu Estilo</h2>
        <div className="categories-grid">
          <Link to="/shop?category=indumentaria" className="category-card cat-apparel">
            <div className="cat-overlay"></div>
            <h3>Indumentaria</h3>
          </Link>
          <Link to="/shop?category=calzado" className="category-card cat-shoes">
            <div className="cat-overlay"></div>
            <h3>Calzado</h3>
          </Link>
          <Link to="/shop?category=accesorios" className="category-card cat-accessories">
            <div className="cat-overlay"></div>
            <h3>Accesorios & Relojes</h3>
          </Link>
          <Link to="/shop?category=fragancias" className="category-card cat-fragrances">
            <div className="cat-overlay"></div>
            <h3>Fragancias</h3>
          </Link>
        </div>
      </section>

      {/* Banner Promocional */}
      <section className="promo-banner glass-panel">
        <div className="promo-content">
          <h2>Unete a la familia NAJAM</h2>
          <p>Registrate para obtener beneficios exclusivos, envíos rápidos y ofertas por Mercado Pago.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
