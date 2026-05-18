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
import CheckoutPage from './components/CheckoutPage';
import OrderSuccessPage from './components/OrderSuccessPage';
import OrderHistory from './components/OrderHistory';
import AboutPage from './components/AboutPage';
import AdminPage from './components/AdminPage';
import LanguageSelector from './components/LanguageSelector';
import useAuth from './hooks/useAuth';
import supabase from './supabaseClient';
import products from './data/products';
import announcement from './data/announcements';
import { useLanguage } from './i18n/LanguageContext';

function App() {
  const { user, signOut, signIn, signUp } = useAuth();
  const { t, lang } = useLanguage();
  const [currentPage, setCurrentPage] = useState('home');

  // 管理员判断（用 useMemo 避免每次渲染重新计算）
  const adminEmails = useMemo(
    () => (import.meta.env.VITE_ADMIN_EMAIL || '').split(',').map(e => e.trim()).filter(Boolean),
    []
  );
  const isAdmin = user && adminEmails.includes(user.email);
  const [lastOrderId, setLastOrderId] = useState(null);
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

  const handleCheckout = async ({ name, phone, address }) => {
    if (!supabase) {
      throw new Error('系统未配置数据库连接，下单功能暂不可用');
    }

    // 1. 插入订单（未登录用户 user_id 为 null）
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id ?? null,
        total_price: totalPrice,
        status: '待处理',
        name,
        phone,
        address,
      })
      .select('id')
      .single();

    if (orderError) throw orderError;
    const orderId = orderData.id;

    // 2. 批量插入订单商品
    const orderItems = cartItems.map((item) => ({
      order_id: orderId,
      product_id: item.product.id,
      product_name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 3. 删除该用户的购物车数据库记录（仅登录用户）
    if (user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id);
    }

    // 4. 清空前端状态并跳转成功页
    setCartItems([]);
    setCartOpen(false);
    setLastOrderId(orderId);
    setCurrentPage('success');
  };

  const changeQuantity = (productId, delta) => {
    setCartItems((prev) => {
      const newItems = prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + delta }
          : item
      );
      // 过滤掉数量 ≤ 0 的商品
      return newItems.filter((item) => item.quantity > 0);
    });
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

  if (currentPage === 'checkout') {
    return (
      <CheckoutPage
        cartItems={cartItems}
        totalPrice={totalPrice}
        user={user}
        onSubmit={handleCheckout}
        onBack={() => setCurrentPage('home')}
        onLoginClick={() => setAuthModalOpen(true)}
      />
    );
  }

  if (currentPage === 'success') {
    return (
      <OrderSuccessPage
        orderId={lastOrderId}
        onContinueShopping={() => {
          setCurrentPage('home');
          setCartOpen(false);
        }}
      />
    );
  }

  if (currentPage === 'orders') {
    return (
      <OrderHistory
        user={user}
        onBack={() => setCurrentPage('home')}
        onLoginClick={() => setAuthModalOpen(true)}
      />
    );
  }

  if (currentPage === 'admin') {
    return (
      <AdminPage
        user={user}
        onBack={() => setCurrentPage('home')}
      />
    );
  }

  // 首页 / 商品页 / 关于页 共享 Navbar + 侧边栏 + 弹窗
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
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isAdmin={isAdmin}
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
        onCheckout={() => {
          setCartOpen(false);
          setCurrentPage('checkout');
        }}
      />

      <WishlistSidebar
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onToggleWishlist={toggleWishlist}
        onAddToCart={addToCart}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        signIn={signIn}
        signUp={signUp}
      />

      <LanguageSelector />

      <AnnouncementModal
        version={announcement.version}
        content={announcement.content}
      />

      <AnnouncementBadge
        version={announcement.version}
        content={announcement.content}
      />

      {/* 页面内容区 */}
      {currentPage === 'home' && (
        <>
          <Hero
            onScrollToProducts={scrollToProducts}
            featuredProducts={products.slice(0, 3)}
            onAddToCart={addToCart}
          />
          <CountdownBanner />
        </>
      )}

      {(currentPage === 'home' || currentPage === 'products') && (
        <ProductList 
          products={products} 
          onAddToCart={addToCart} 
          sectionRef={currentPage === 'home' ? productsSectionRef : null}
          wishlistItems={wishlistItems}
          onToggleWishlist={toggleWishlist}
        />
      )}

      {currentPage === 'about' && <AboutPage />}

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