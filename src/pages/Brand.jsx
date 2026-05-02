import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Brand = () => {
  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ fontSize: '4rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}
        >
          El Manifiesto
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#aaa', display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          <p>
            No nacimos para seguir tendencias. Nacimos para dictarlas.
            NAJAM es más que indumentaria; es una declaración de intenciones. 
            Es para aquellos que caminan por la ciudad sabiendo que el asfalto es su propia pasarela.
          </p>

          <p>
            Desde 9 de Julio para el mundo, fusionamos la rudeza de la cultura urbana con 
            la sofisticación de la alta costura. Cada prenda, cada corte y cada textura es 
            seleccionada con un nivel obsesivo de detalle.
          </p>

          <p>
            <strong style={{ color: '#fff', letterSpacing: '0.1em' }}>NAJAM BLACK LABEL</strong> no es para todos.<br/>
            Es una línea ultra-exclusiva diseñada para una comunidad selecta. Acceder a 
            nuestros lanzamientos limitados ("Drops") significa pertenecer a la verdadera 
            vanguardia estética.
          </p>

          <div style={{ marginTop: '3rem' }}>
            <Link to="/shop" style={{ display: 'inline-block', padding: '1rem 2rem', border: '1px solid #fff', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', transition: 'all 0.3s ease' }} 
            onMouseOver={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#000'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#fff'; }}
            >
              Únete a la Cultura
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Brand;
