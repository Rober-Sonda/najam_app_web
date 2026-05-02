import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    // Set drop date to exactly 14 days from now for demonstration
    const dropDate = new Date();
    dropDate.setDate(dropDate.getDate() + 14);
    
    const interval = setInterval(() => {
      const now = new Date();
      const difference = dropDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      {/* Drop Countdown Section */}
      <section className="drop-banner">
        <div className="drop-content">
          <span className="drop-badge"><Clock size={16}/> EXCLUSIVO</span>
          <h2>PRÓXIMO DROP: COLECCIÓN VERANO</h2>
          <div className="countdown">
            <div className="time-box">
              <span className="time-num">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="time-label">DÍAS</span>
            </div>
            <span className="separator">:</span>
            <div className="time-box">
              <span className="time-num">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="time-label">HRS</span>
            </div>
            <span className="separator">:</span>
            <div className="time-box">
              <span className="time-num">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="time-label">MIN</span>
            </div>
            <span className="separator">:</span>
            <div className="time-box">
              <span className="time-num">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="time-label">SEG</span>
            </div>
          </div>
          <p className="drop-desc">Unidades ultra-limitadas. Solo para miembros VIP.</p>
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-subtitle">NAJAM BLACK LABEL</span><br/>
            DESTILA<br/>ORIGINALIDAD
          </h1>
          <p className="hero-text">Glamour y tendencia en cada detalle. Descubre el estilo que te define.</p>
          <div className="hero-actions">
            <Link to="/shop" className="hero-btn">
              Explorar Colección <ArrowRight size={18} />
            </Link>
            <Link to="/lookbook" className="hero-btn secondary">
              Ver Lookbook
            </Link>
          </div>
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
          <h2>Conviértete en VIP</h2>
          <p>Registrate y accede a lanzamientos secretos, piezas ultra limitadas y envíos prioritarios.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
