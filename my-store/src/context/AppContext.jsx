import { createContext, useContext } from 'react';

const AppContext = createContext(null);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    if (typeof window !== 'undefined' && !window.__appContextWarned) {
      window.__appContextWarned = true;
      console.warn('useAppContext: AppContext.Provider 未找到，使用默认空值。请确保组件在 AppContext.Provider 内部。');
    }
    // 返回安全的默认值，避免页面崩溃
    return {
      user: null,
      isAdmin: false,
      cartItems: [],
      totalCount: 0,
      totalPrice: 0,
      wishlistItems: [],
      cartIconRef: { current: null },
      productsSectionRef: { current: null },
      lastOrderId: null,
      addToCart: () => {},
      toggleWishlist: () => {},
      removeFromCart: () => {},
      clearCart: () => {},
      changeQuantity: () => {},
      setItemQuantity: () => {},
      signOut: async () => {},
      signIn: async () => {},
      signUp: async () => {},
      handleCheckout: async () => {},
      setCartOpen: () => {},
      setWishlistOpen: () => {},
      setAuthModalOpen: () => {},
      scrollToProducts: () => {},
    };
  }
  return ctx;
}

export default AppContext;
