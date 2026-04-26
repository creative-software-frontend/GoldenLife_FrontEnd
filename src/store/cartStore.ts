import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: number;
    name: string;
    product_title_english?: string;
    image: string;
    quantity: number;
    regular_price: number; // This is actually the CUSTOMER PRICE in the UI
    offer_price: number;   // This is actually the MEMBER PRICE in the UI
    original_regular_price?: number;
    vendor_id?: number | string;
    type?: string;
}

interface CartState {
    cartItems: CartItem[];
    isCartOpen: boolean;
    
    // Actions
    toggleCart: () => void;
    addItem: (item: CartItem) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, delta: number) => void;
    updatePrice: (id: number, newPrice: number) => void;
    clearCart: () => void;
    
    // Derived values (can be implemented as functions or computed in components)
    getTotalItems: () => number;
    getSubtotal: () => number; // Total based on offer_price (Member Price)
    getCustomerTotal: () => number; // Total based on regular_price (Customer Price)
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cartItems: [],
            isCartOpen: false,

            toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

            addItem: (item) => set((state) => {
                const existingItemIndex = state.cartItems.findIndex((i) => i.id === item.id);
                if (existingItemIndex !== -1) {
                    const newCartItems = [...state.cartItems];
                    newCartItems[existingItemIndex].quantity += (item.quantity || 1);
                    return { cartItems: newCartItems };
                }
                return { cartItems: [...state.cartItems, { ...item, quantity: item.quantity || 1 }] };
            }),

            removeItem: (id) => set((state) => ({
                cartItems: state.cartItems.filter((i) => i.id !== id)
            })),

            updateQuantity: (id, delta) => set((state) => ({
                cartItems: state.cartItems.map((item) =>
                    item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
                )
            })),

            updatePrice: (id, newPrice) => set((state) => ({
                cartItems: state.cartItems.map((item) =>
                    item.id === id ? { ...item, regular_price: newPrice } : item
                )
            })),

            clearCart: () => set({ cartItems: [] }),

            getTotalItems: () => {
                return get().cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
            },

            getSubtotal: () => {
                return get().cartItems.reduce((acc, item) => acc + (item.offer_price * (item.quantity || 0)), 0);
            },

            getCustomerTotal: () => {
                return get().cartItems.reduce((acc, item) => acc + (item.regular_price * (item.quantity || 0)), 0);
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
            // Map legacy 'cart' from localStorage on initialization if needed
            onRehydrateStorage: () => (state) => {
                if (state && state.cartItems.length === 0) {
                    const legacyCart = localStorage.getItem('cart');
                    if (legacyCart) {
                        try {
                            const parsed = JSON.parse(legacyCart);
                            if (Array.isArray(parsed)) {
                                state.cartItems = parsed.map(item => ({
                                    ...item,
                                    regular_price: Number(item.regular_price) || 0,
                                    offer_price: Number(item.offer_price) || 0,
                                    quantity: Number(item.quantity) || 1
                                }));
                            }
                        } catch (e) {
                            console.error("Failed to parse legacy cart", e);
                        }
                    }
                }
            }
        }
    )
);
