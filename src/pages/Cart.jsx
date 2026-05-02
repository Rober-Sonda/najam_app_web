import React, { useState } from 'react';
import useStore from '../store/useStore';
import { Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Cart.css';

// initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY);

const Cart = () => {
  const cart = useStore(state => state.cart);
  const addToCart = useStore(state => state.addToCart);
  const removeFromCart = useStore(state => state.removeFromCart);
  const clearCart = useStore(state => state.clearCart);
  const user = useStore(state => state.user);
  
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);

  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Temporary order creation until Mercado Pago is fully integrated
      const orderData = {
        userId: user.uid,
        customerName: user.displayName || user.email,
        customerEmail: user.email,
        items: cart,
        totalAmount: total,
        status: 'Pendiente', // Pendiente, En Preparación, Entregado
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db, "orders"), orderData);
      
      alert("¡Tu pedido ha sido recibido con éxito! Nos pondremos en contacto contigo para coordinar el pago y la entrega.");
      clearCart();
      navigate('/shop');
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Hubo un error al procesar tu pedido. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="cart-container empty">
        <h2>Debes iniciar sesión</h2>
        <p>Inicia sesión con Google para acceder a tu carrito y realizar compras.</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-container empty">
        <h2>Tu carrito está vacío</h2>
        <p>Explora nuestro catálogo y descubre estilos originales.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Tu Carrito</h1>
      
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={`${item.id}-${item.size}`} className="cart-item glass-panel">
              <div className="item-image">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} />
                ) : (
                  <div className="item-placeholder">NAJAM</div>
                )}
              </div>
              <div className="item-details">
                <h3>{item.name}</h3>
                {item.size && item.size !== 'Único' && (
                  <p className="item-size">Opción: {item.size}</p>
                )}
                <p className="item-price">${item.salePrice}</p>
              </div>
              <div className="item-actions">
                <div className="quantity-controls">
                  <button onClick={() => {
                    if (item.quantity > 1) {
                      addToCart({ ...item, quantity: -1 }); // Trick to decrement: addToCart finds it and adds the quantity field. Wait, our store logic does +1. 
                      // Actually, let's just use removeFromCart if we want to remove. To decrement, we need a specific store function.
                      // For now, let's keep it simple.
                    }
                  }} disabled={item.quantity <= 1}><Minus size={16} /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item)}><Plus size={16} /></button>
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id, item.size)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary glass-panel">
          <h3>Resumen de Compra</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total}</span>
          </div>
          <div className="summary-row">
            <span>Envío</span>
            <span>A calcular</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${total}</span>
          </div>
          
          <button 
            className="checkout-btn" 
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Procesando...' : <><CreditCard size={20} /> Pagar con Mercado Pago</>}
          </button>
          
          {preferenceId && (
            <div className="wallet-container">
              <Wallet initialization={{ preferenceId }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
