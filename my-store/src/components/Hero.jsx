import { useState, useRef, useCallback, useEffect } from 'react';
import ProductDetail from './ProductDetail';
import { useLanguage } from '../i18n/LanguageContext';

const slides = [
  {
    type: 'brand',
    image: 'https://placehold.co/1920x1080/1e293b/f8fafc?text=New+Collection',
    titleKey: 'newArrival',
    subtitleKey: 'exploreCollection',
    product: null,
  },
];

function Hero({ onScrollToProducts, featuredProducts, onAddToCart }) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  const [animating, setAnimating] = useState(false);
  const animatingRef = useRef(false);
  const touchStartX = useRef(null);

  const allSlides = [...slides];
  if (featuredProducts && featuredProducts.length > 0) {
    featuredProducts.forEach((p) => {
      allSlides.push({
        type: 'product',
        image: p.image,
        title: p.name,
        subtitle: `¥${p.price}`,
        product: p,
      });
    });
  }

  const totalSlides = allSlides.length;

  const goTo = useCallback((index) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    setAnimating(true);
    setCurrent((index + totalSlides) % totalSlides);
  }, [totalSlides]);

  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  // 自动播放：10s 切换，鼠标悬停时暂停
  useEffect(() => {
    if (totalSlides <= 1 || isHovering) return;
    const timer = setInterval(() => {
      animatingRef.current = true;
      setAnimating(true);
      setCurrent((prev) => (prev + 1) % totalSlides);
    }, 10000);
    return () => clearInterval(timer);
  }, [totalSlides, isHovering]);

  const slide = allSlides[current];

  return (
    <>
      <section
        className="relative bg-gray-900 text-white overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10 pointer-events-none" />

        {/* 轮播轨道 */}
        <div
          className={`flex h-[50vh] sm:h-[60vh] lg:h-[70vh] min-h-[350px] sm:min-h-[450px] lg:min-h-[500px] transition-transform duration-700 ease-in-out ${
            isHovering ? 'scale-105' : 'scale-100'
          }`}
          style={{
            transform: `translateX(-${current * 100}%)`,
            transitionDuration: animating ? '700ms' : '0ms',
          }}
          onTransitionEnd={() => { setAnimating(false); animatingRef.current = false; }}
        >
          {allSlides.map((s, i) => (
            <div
              key={i}
              className={`w-full flex-shrink-0 bg-cover bg-center ${
                s.type === 'product' ? 'cursor-pointer' : ''
              }`}
              style={{ backgroundImage: `url(${s.image})` }}
              onClick={() => {
                if (s.type === 'product' && s.product) {
                  setDetailProduct(s.product);
                }
              }}
            />
          ))}
        </div>

        {/* 文字内容 */}
        <div className="absolute inset-0 z-20 flex items-center pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 tracking-tight">
              {slide.titleKey ? t(slide.titleKey) : slide.title}
            </h1>
            <p className="text-sm sm:text-base lg:text-xl text-gray-200 mb-6 sm:mb-8 max-w-lg">
              {slide.subtitleKey ? t(slide.subtitleKey) : slide.subtitle}
            </p>
            <button
              onClick={onScrollToProducts}
              className="pointer-events-auto bg-blue-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-md text-sm sm:text-base font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              {t('addToCart')}
            </button>
          </div>
        </div>

        {/* 指示器圆点 */}
        {totalSlides > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {allSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === current
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}

        {/* 左箭头 */}
        {totalSlides > 1 && (
          <button
            onClick={prev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all"
            aria-label="上一张"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* 右箭头 */}
        {totalSlides > 1 && (
          <button
            onClick={next}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all"
            aria-label="下一张"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </section>

      {/* 产品详情弹窗 */}
      {detailProduct && (
        <ProductDetail
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </>
  );
}

export default Hero;