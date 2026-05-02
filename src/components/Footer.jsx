import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
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
            <li><Link to="/shop?category=indumentaria">Indumentaria</Link></li>
            <li><Link to="/shop?category=calzado">Calzado</Link></li>
            <li><Link to="/shop?category=accesorios">Accesorios</Link></li>
            <li><Link to="/shop?category=fragancias">Fragancias</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Encontranos</h3>
          <a href="https://www.google.com/maps/@-35.44277,-60.8897647,3a,75y,170.66h,79.21t/data=!3m7!1e1!3m5!1swhj1afOhPfRjhn_aqfAF9Q!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D10.792163536684924%26panoid%3Dwhj1afOhPfRjhn_aqfAF9Q%26yaw%3D170.65605618088625!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDQyOS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="social-link" style={{ marginBottom: '1rem' }}>
            <MapPin size={16} className="inline-icon" /> Poratti 1508, 9 de Julio (6500), Bs As
          </a>
          <a href="https://www.instagram.com/najam_oficial/" target="_blank" rel="noopener noreferrer" className="social-link">
            Instagram: @najam_oficial
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
