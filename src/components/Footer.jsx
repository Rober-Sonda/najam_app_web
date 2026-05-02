import React from 'react';
import { Instagram, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <h2 className="footer-logo">NAJAM</h2>
          <p className="footer-tagline">Glamour, Tendencia, Originalidad.</p>
        </div>
        
        <div className="footer-links">
          <h3>Categorías</h3>
          <ul>
            <li>Indumentaria</li>
            <li>Calzado</li>
            <li>Accesorios</li>
            <li>Fragancias</li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Encontranos</h3>
          <p><MapPin size={16} className="inline-icon" /> Poratti 1508, 9 de Julio (6500), Bs As</p>
          <a href="https://www.instagram.com/najam_oficial/" target="_blank" rel="noopener noreferrer" className="social-link">
            <Instagram size={20} /> @najam_oficial
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} NAJAM Oficial. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
