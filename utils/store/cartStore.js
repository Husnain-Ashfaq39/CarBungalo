import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addItem: (product) => 
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          
          if (existingItem) {
            // If item exists, increment quantity
            return {
              items: state.items.map(item =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          
          // If item doesn't exist, add it with quantity 1
          return {
            items: [...state.items, { ...product, quantity: 1 }],
          };
        }),
      
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        })),
      
      clearCart: () => set({ items: [] }),
      
      getCartTotal: () => {
        const store = useCartStore.getState();
        return store.items.reduce((total, item) => {
          const price = item.discountPrice || item.price;
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'cart-storage', // unique name for localStorage
    }
  )
);

export default useCartStore; 