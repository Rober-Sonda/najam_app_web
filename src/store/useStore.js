import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  
  cart: [],
  addToCart: (product) => set((state) => {
    const existing = state.cart.find(item => item.id === product.id && item.size === product.size);
    if (existing) {
      return {
        cart: state.cart.map(item => 
          item.id === product.id && item.size === product.size 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };
    }
    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  }),
  removeFromCart: (productId, size) => set((state) => ({
    cart: state.cart.filter(item => !(item.id === productId && item.size === size))
  })),
  clearCart: () => set({ cart: [] }),
  
  announcements: [],
  setAnnouncements: (announcements) => set({ announcements }),
}));

export default useStore;
