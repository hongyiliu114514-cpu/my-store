import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import WishlistSidebar from './components/WishlistSidebar';
import FlyingItem from './components/FlyingItem';
import BackToTop from './components/BackToTop';
import CountdownBanner from './components/CountdownBanner';
import AuthModal from './components/AuthModal';
import AnnouncementModal from './components/AnnouncementModal';
import AnnouncementBadge from './components/AnnouncementBadge';
import useAuth from './hooks/useAuth';
import products from './data/products';
import announcement from './data/announcements';

function App() {
  const { user, signOut, signIn, signUp } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
  try {
    const saved = localStorage.getItem('myStoreCart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
});
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('myStoreWishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const productsSectionRef = useRef(null);
  const cartIconRef = useRef(null);

  // 飞入动画状态
  const [flyingItems, setFlyingItems] = useState([]);
  const flyingIdCounter = useRef(0);

  const totalCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
  const totalPrice = useMemo(() => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cartItems]);

  const addToCart = useCallback((product, sourceRect) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    // 触发飞入动画
    if (sourceRect && cartIconRef.current) {
      const cartRect = cartIconRef.current.getBoundingClientRect();
      const id = ++flyingIdCounter.current;
      setFlyingItems((prev) => [
        ...prev,
        {
          id,
          product,
          startX: sourceRect.left + sourceRect.width / 2,
          startY: sourceRect.top + sourceRect.height / 2,
          endX: cartRect.left + cartRect.width / 2,
          endY: cartRect.top + cartRect.height / 2,
        },
      ]);
      setTimeout(() => {
        setFlyingItems((prev) => prev.filter((f) => f.id !== id));
      }, 600);
    }
  }, []);

  const toggleWishlist = useCallback((product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const changeQuantity = (productId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const setItemQuantity = (productId, quantity) => {
    const qty = Math.max(1, Math.min(99, parseInt(quantity, 10) || 1));
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  // 购物车数据持久化
  useEffect(() => {
    try {
      localStorage.setItem('myStoreCart', JSON.stringify(cartItems));
    } catch { /* localStorage 不可用时静默失败 */ }
  }, [cartItems]);

  // 愿望清单数据持久化
  useEffect(() => {
    try {
      localStorage.setItem('myStoreWishlist', JSON.stringify(wishlistItems));
    } catch { /* localStorage 不可用时静默失败 */ }
  }, [wishlistItems]);

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar 
        cartCount={totalCount} 
        wishlistCount={wishlistItems.length}
        onCartClick={() => setCartOpen(true)} 
        onWishlistClick={() => setWishlistOpen(true)}
        cartItems={cartItems}
        totalCount={totalCount}
        totalPrice={totalPrice}
        cartIconRef={cartIconRef}
        user={user}
        onLoginClick={() => setAuthModalOpen(true)}
        onLogout={signOut}
      />

      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        totalCount={totalCount}
        totalPrice={totalPrice}
        onChangeQuantity={changeQuantity}
        onSetQuantity={setItemQuantity}
        onRemoveItem={removeFromCart}
        onClear={clearCart}
      />

      <WishlistSidebar
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onToggleWishlist={toggleWishlist}
        onAddToCart={addToCart}
      />

      <Hero
        onScrollToProducts={scrollToProducts}
        featuredProducts={products.slice(0, 3)}
        onAddToCart={addToCart}
      />

      <CountdownBanner />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        signIn={signIn}
        signUp={signUp}
      />

      <AnnouncementModal
        version={announcement.version}
        content={announcement.content}
      />

      <AnnouncementBadge
        version={announcement.version}
        content={announcement.content}
      />

      <ProductList 
        products={products} 
        onAddToCart={addToCart} 
        sectionRef={productsSectionRef}
        wishlistItems={wishlistItems}
        onToggleWishlist={toggleWishlist}
      />
      <Footer />

      <BackToTop />

      {/* 飞入动画层 */}
      {flyingItems.map((item) => (
        <FlyingItem key={item.id} {...item} />
      ))}
    </div>
  );
}

export default App;