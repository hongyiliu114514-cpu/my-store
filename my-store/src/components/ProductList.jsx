import { useState, useMemo, useEffect, useRef, memo } from 'react';
import ProductDetail from './ProductDetail';
import StarRating from './StarRating';

// AOS (Animate on Scroll) Hook
function useAOS() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

// 为每个商品生成伪随机星级（基于id固定）
function getRating(productId) {
  const ratings = [4.5, 4.0, 5.0, 4.8, 4.2, 4.6];
  const counts = [128, 56, 203, 91, 37, 74];
  return {
    rating: ratings[(productId - 1) % ratings.length],
    count: counts[(productId - 1) % counts.length],
  };
}

const ProductCard = memo(function ProductCard({ product, onAddToCart, wishlistItems, onToggleWishlist, index }) {
  const [aosRef, aosVisible] = useAOS();
  const cardRef = useRef(null);
  const isLiked = wishlistItems.some((item) => item.id === product.id);
  const { rating, count } = getRating(product.id);

  const handleAddToCart = (e) => {
    const rect = cardRef.current?.querySelector('img')?.getBoundingClientRect();
    onAddToCart(product, rect);
  };

  return (
    <div
      ref={(el) => {
        aosRef.current = el;
        cardRef.current = el;
      }}
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 ${
        aosVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* 图片容器 */}
      <div
        className="relative w-56 h-56 mx-auto mt-5 overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-105 group"
        onClick={() => {
          const detailEvent = new CustomEvent('openDetail', { detail: product });
          window.dispatchEvent(detailEvent);
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {/* 收藏按钮 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center
            transition-all duration-200 shadow-md
            ${isLiked
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>

        {/* 星级评价 */}
        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={rating} />
          <span className="text-xs text-gray-400">({count}条评价)</span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xs text-gray-400">
            已售{product.sales >= 100 ? '99+' : product.sales}件
          </span>
          <span className="text-xl font-bold text-gray-900">
            ¥{product.price}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors active:scale-95"
        >
          加入购物车
        </button>
      </div>
    </div>
  );
});

function ProductList({ products, onAddToCart, sectionRef, wishlistItems, onToggleWishlist }) {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [detailProduct, setDetailProduct] = useState(null);

  // 监听自定义事件打开详情
  useEffect(() => {
    const handler = (e) => setDetailProduct(e.detail);
    window.addEventListener('openDetail', handler);
    return () => window.removeEventListener('openDetail', handler);
  }, []);

  const categories = useMemo(() => {
    const cats = products.map((p) => p.category).filter(Boolean);
    return ['全部', ...Array.from(new Set(cats))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === '全部') return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
        热门商品
      </h2>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={
              selectedCategory === cat
                ? 'bg-gray-900 text-white px-5 py-2 rounded-md font-medium transition-colors'
                : 'bg-gray-200 text-gray-600 px-5 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors'
            }
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onAddToCart={onAddToCart}
            wishlistItems={wishlistItems}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>

      {detailProduct && (
        <ProductDetail 
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </section>
  );
}

export default ProductList;