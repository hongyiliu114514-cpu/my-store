import { useState, useRef, useEffect } from 'react';

function Navbar({ cartCount, onCartClick, cartItems, totalCount, totalPrice }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const previewTimerRef = useRef(null);

  const handleMouseEnter = () => {
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
    }
    setShowPreview(true);
  };

  const handleMouseLeave = () => {
    previewTimerRef.current = setTimeout(() => setShowPreview(false), 200);
  };

  useEffect(() => {
    return () => {
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="text-2xl font-bold tracking-wider text-gray-900">
            MYSTORE
          </a>

          {/* 中间菜单 - 桌面端 */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              首页
            </a>
            <a href="/products" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              全部商品
            </a>
            <a href="/about" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              关于我们
            </a>
          </nav>

          {/* 右侧：购物车图标 + 汉堡菜单按钮 */}
          <div className="flex items-center gap-2">
            {/* 购物车图标 + 预览 */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={onCartClick}
                className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* 购物车预览气泡 */}
              {showPreview && cartItems && cartItems.length > 0 && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-2xl z-50">
                  <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45" />

                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-800">
                      购物车 · {totalCount}件
                    </span>
                    <button onClick={onCartClick} className="text-xs text-blue-500 hover:text-blue-700">
                      查看全部 →
                    </button>
                  </div>

                  <div className="max-h-64 overflow-y-auto px-4 py-2 space-y-3">
                    {cartItems.slice(0, 3).map((item) => (
                      <div key={item.product.id} className="flex gap-3 items-center">
                        <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 truncate">{item.product.name}</p>
                          <p className="text-xs text-gray-500">¥{item.product.price} × {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                          ¥{item.product.price * item.quantity}
                        </p>
                      </div>
                    ))}
                    {cartItems.length > 3 && (
                      <p className="text-xs text-gray-400 text-center py-1">
                        还有 {cartItems.length - 3} 件商品...
                      </p>
                    )}
                  </div>

                  <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center bg-gray-50 rounded-b-lg">
                    <span className="text-sm font-semibold text-gray-800">合计</span>
                    <span className="text-lg font-bold text-red-500">¥{totalPrice}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 汉堡菜单按钮 - 移动端 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="菜单"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 移动端下拉菜单 */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 py-3 space-y-2">
            <a href="/" className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors">
              首页
            </a>
            <a href="/products" className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors">
              全部商品
            </a>
            <a href="/about" className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors">
              关于我们
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;