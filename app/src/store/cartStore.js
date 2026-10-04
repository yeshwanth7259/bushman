import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],
  addToCart: (product) => {
    const { items } = get();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      set({ items: items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) });
    } else {
      set({ items: [...items, { ...product, quantity: 1 }] });
    }
  },
  removeFromCart: (productId) => {
    set({ items: get().items.filter(i => i.id !== productId) });
  },
  incrementQuantity: (productId) => {
    set({ items: get().items.map(i => i.id === productId ? { ...i, quantity: i.quantity + 1 } : i) });
  },
  decrementQuantity: (productId) => {
    const { items } = get();
    const existing = items.find(i => i.id === productId);
    if (existing && existing.quantity > 1) {
      set({ items: items.map(i => i.id === productId ? { ...i, quantity: i.quantity - 1 } : i) });
    } else {
      set({ items: items.filter(i => i.id !== productId) });
    }
  },
  clearCart: () => set({ items: [] }),
  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + (parseFloat(item.price || 0) * item.quantity), 0);
  }
}));

export default useCartStore;
