import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Lookbook.css';

const Lookbook = () => {
  return (
    <div className="lookbook-container">
      <div className="lookbook-header">
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          LOOKBOOK
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          COLECCIÓN VERANO 2026. LA ACTITUD NAJAM.
        </motion.p>
      </div>

      <div className="editorial-section">
        <div className="editorial-image-container">
          {/* We reuse the apparel category image as an editorial shot for now */}
          <div className="editorial-image" style={{backgroundImage: "url('/cat_apparel.png')"}}></div>
          <div className="editorial-text right">
            <h2>Noches de Ciudad</h2>
            <p>El contraste perfecto entre el asfalto y la alta costura urbana.</p>
            <Link to="/shop?category=indumentaria" className="shop-the-look">Comprar el Look</Link>
          </div>
        </div>
      </div>

      <div className="editorial-section">
        <div className="editorial-image-container">
          <div className="editorial-image" style={{backgroundImage: "url('/cat_shoes.png')"}}></div>
          <div className="editorial-text left">
            <h2>Pisada Firme</h2>
            <p>Diseño exclusivo que marca tendencia en cada paso.</p>
            <Link to="/shop?category=calzado" className="shop-the-look">Comprar el Look</Link>
          </div>
        </div>
      </div>
      
      <div className="editorial-section">
        <div className="editorial-image-container">
          <div className="editorial-image" style={{backgroundImage: "url('/cat_accessories.png')"}}></div>
          <div className="editorial-text right">
            <h2>Detalles que Importan</h2>
            <p>El verdadero lujo se encuentra en las pequeñas cosas.</p>
            <Link to="/shop?category=accesorios" className="shop-the-look">Comprar el Look</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lookbook;
