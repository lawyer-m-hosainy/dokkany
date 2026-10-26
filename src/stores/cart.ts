import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, CartItem } from '@/types/store';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string;
  discountAmount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  clearCoupon: () => void;
  getItemsCount: () => number;
  getSubtotal: () => number;
  getTotal: (shippingFee?: number) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: '',
      discountAmount: 0,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product: Product, quantity = 1, selectedColor) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.selectedColor === selectedColor
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            return { items: newItems, isOpen: true };
          }

          return {
            items: [...state.items, { product, quantity, selectedColor }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], couponCode: '', discountAmount: 0 });
      },

      applyCoupon: (code: string, discount: number) => {
        set({ couponCode: code, discountAmount: discount });
      },

      clearCoupon: () => {
        set({ couponCode: '', discountAmount: 0 });
      },

      getItemsCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      getTotal: (shippingFee = 0) => {
        const subtotal = get().getSubtotal();
        const discount = get().discountAmount;
        return Math.max(0, subtotal - discount) + shippingFee;
      },
    }),
    {
      name: 'dokkany-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discountAmount: state.discountAmount,
      }),
    }
  )
);
