import { useState, useRef, useEffect, useCallback } from 'react';
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
import useAuth from './hooks/useAuth';
import sunglassesImg from './assets/sunglasses.jpg';


const products = [
  { 
    id: 1, 
    name: '经典帆布包', 
    price: 299, 
    sales: 168,
    category: '包袋',
    image: 'https://placehold.co/400x400/e2e8f0/64748b?text=帆布包',
    description: '优质帆布材质，简约设计，大容量收纳，日常通勤首选。',
    details: ['材质：纯棉帆布', '尺寸：35cm x 25cm x 12cm', '颜色：米白/黑色可选', '承重：最高5kg']
  },
  { 
    id: 2, 
    name: '极简手表', 
    price: 599, 
    sales: 89,
    category: '配饰',
    image: 'https://placehold.co/400x400/e2e8f0/64748b?text=手表',
    description: '极简表盘设计，真皮表带，日本机芯，商务休闲两相宜。',
    details: ['表盘直径：40mm', '表带材质：真皮', '防水：3ATM', '保修期：2年']
  },
  { 
    id: 3, 
    name: '复古太阳镜', 
    price: 199, 
    sales: 256,
    category: '配饰',
    image: sunglassesImg,
    description: '经典复古圆框，偏光镜片，UV400防护，春夏出行必备。',
    details: ['镜框材质：金属', '镜片：偏光防紫外线', '重量：28g', '附赠眼镜盒']
  },
  { 
    id: 4, 
    name: '纯棉T恤', 
    price: 159, 
    sales: 432,
    category: '服饰',
    image: 'https://placehold.co/400x400/e2e8f0/64748b?text=T恤',
    description: '100%精梳棉，宽松版型，亲肤透气，四季百搭基础款。',
    details: ['材质：100%精梳棉', '版型：宽松落肩', '克重：220g', '尺码：S/M/L/XL']
  },
  { 
    id: 5, 
    name: '斜挎胸包', 
    price: 259, 
    sales: 65,
    category: '包袋',
    image: 'https://placehold.co/400x400/e2e8f0/64748b?text=胸包',
    description: '防水尼龙面料，多隔层设计，轻便出行，通勤运动皆可。',
    details: ['材质：防水尼龙', '尺寸：20cm x 15cm x 6cm', '隔层：3个主袋', '肩带可调节']
  },
  { 
    id: 6, 
    name: '编织腰带', 
    price: 129, 
    sales: 112,
    category: '配饰',
    image: 'https://placehold.co/400x400/e2e8f0/64748b?text=腰带',
    description: '弹力编织工艺，无孔设计，自由调节松紧，舒适不勒腰。',
    details: ['材质：弹力织带', '宽度：3.5cm', '扣头：合金', '适用腰围：80-110cm']
  },
];

function App() {
  const { user, signOut } = useAuth();
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
  let flyingIdCounter = useRef(0);

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

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

  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some((item) => item.id === productId);
  }, [wishlistItems]);

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
    localStorage.setItem('myStoreCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 愿望清单数据持久化
  useEffect(() => {
    localStorage.setItem('myStoreWishlist', JSON.stringify(wishlistItems));
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