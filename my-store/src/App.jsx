import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
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
import AppContext from './context/AppContext';

function App() {
  const { user, signOut, signIn, signUp } = useAuth();
  const navigate = useNavigate();

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
    navigate('/order-success');
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

  // 使用 useMemo 稳定 Provider value，避免每次渲染创建新对象导致消费者不必要的重渲染
  const contextValue = useMemo(() => ({
    user, isAdmin, cartItems, totalCount, totalPrice,
    wishlistItems, cartIconRef, productsSectionRef, lastOrderId,
    addToCart, toggleWishlist, removeFromCart, clearCart,
    changeQuantity, setItemQuantity, signOut, signIn, signUp,
    handleCheckout, setCartOpen, setWishlistOpen, setAuthModalOpen,
    scrollToProducts,
  }), [
    user, isAdmin, cartItems, totalCount, totalPrice,
    wishlistItems, lastOrderId,
    addToCart, toggleWishlist, removeFromCart, clearCart,
    changeQuantity, setItemQuantity, signOut, signIn, signUp,
    handleCheckout, setCartOpen, setWishlistOpen, setAuthModalOpen,
    scrollToProducts,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

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
          navigate('/checkout');
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

      {/* 路由内容区 */}
      <Routes>
        {/* 首页：Hero + ProductList */}
        <Route path="/" element={
          <>
            <Hero
              onScrollToProducts={scrollToProducts}
              featuredProducts={products.slice(0, 3)}
              onAddToCart={addToCart}
            />
            <CountdownBanner />
            <ProductList
              products={products}
              onAddToCart={addToCart}
              sectionRef={productsSectionRef}
              wishlistItems={wishlistItems}
              onToggleWishlist={toggleWishlist}
            />
          </>
        } />

        {/* 商品列表页 */}
        <Route path="/products" element={
          <ProductList
            products={products}
            onAddToCart={addToCart}
            wishlistItems={wishlistItems}
            onToggleWishlist={toggleWishlist}
          />
        } />

        {/* 关于我们 */}
        <Route path="/about" element={<AboutPage />} />

        {/* 我的订单 */}
        <Route path="/orders" element={
          <OrderHistory
            user={user}
            onBack={() => navigate('/')}
            onLoginClick={() => setAuthModalOpen(true)}
          />
        } />

        {/* 结算页 */}
        <Route path="/checkout" element={
          <CheckoutPage
            cartItems={cartItems}
            totalPrice={totalPrice}
            user={user}
            onSubmit={handleCheckout}
            onBack={() => navigate('/')}
            onLoginClick={() => setAuthModalOpen(true)}
          />
        } />

        {/* 下单成功 */}
        <Route path="/order-success" element={
          <OrderSuccessPage
            orderId={lastOrderId}
            onContinueShopping={() => {
              setCartOpen(false);
              navigate('/');
            }}
          />
        } />

        {/* 管理后台 */}
        <Route path="/admin" element={
          <AdminPage
            user={user}
            onBack={() => navigate('/')}
          />
        } />
      </Routes>

      <Footer />
      <BackToTop />

      {/* 飞入动画层 */}
      {flyingItems.map((item) => (
        <FlyingItem key={item.id} {...item} />
      ))}
    </div>
    </AppContext.Provider>
  );
}

export default App;