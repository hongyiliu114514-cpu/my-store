import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppContext } from '../context/AppContext';

const navLinkClass = ({ isActive }) =>
  `font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`;

function Navbar() {
  const { t, lang, setShowSelector } = useLanguage();
  const {
    user, isAdmin, cartItems, totalCount, totalPrice,
    wishlistItems, cartIconRef, signOut,
    setCartOpen, setWishlistOpen, setAuthModalOpen,
  } = useAppContext();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const previewTimerRef = useRef(null);

  const handleMouseEnter = () => {
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    setShowPreview(true);
  };

  const handleMouseLeave = () => {
    previewTimerRef.current = setTimeout(() => setShowPreview(false), 200);
  };

  useEffect(() => {
    return () => {
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    };
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="text-base sm:text-xl font-bold tracking-wider text-gray-900 hover:text-gray-700 transition-colors">
            {t('brand')}
          </Link>

          {/* 中间菜单 - 桌面端 */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" end className={navLinkClass}>{t('home')}</NavLink>
            <NavLink to="/products" className={navLinkClass}>{t('allProducts')}</NavLink>
            <NavLink to="/about" className={navLinkClass}>{t('aboutUs')}</NavLink>
            {user && (
              <NavLink to="/orders" className={navLinkClass}>{t('myOrders')}</NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass}>
                {lang === 'en' ? 'Admin Panel' : '管理后台'}
              </NavLink>
            )}
          </nav>

          {/* 右侧：用户 + 收藏 + 购物车图标 + 汉堡菜单按钮 */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* 登录/用户按钮 */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-1.5 px-2 py-1.5 text-gray-700 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={signOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg transition-colors"
                  >
                    {t('logout')}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">{t('login')}</span>
              </button>
            )}

            {/* 语言切换 */}
            <button
              onClick={() => setShowSelector(true)}
              className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
              title={t('languageSelect')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </button>

            {/* 收藏图标 */}
            <button
              onClick={() => setWishlistOpen(true)}
              className="relative p-1.5 sm:p-2 text-gray-700 hover:text-red-500 transition-colors"
              aria-label={t('wishlist')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* 购物车图标 + 预览 */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                ref={cartIconRef}
                onClick={() => setCartOpen(true)}
                className="relative p-1.5 sm:p-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </button>

              {/* 购物车预览气泡 */}
              {showPreview && cartItems && cartItems.length > 0 && (
                <div className="hidden sm:block absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-gray-200 rounded-lg shadow-2xl z-50">
                  <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45" />
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-800">
                      {t('cart')} · {totalCount}{t('soldPcs')}
                    </span>
                    <button onClick={() => setCartOpen(true)} className="text-xs text-blue-500 hover:text-blue-700">
                      {t('viewAll')}
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
                        <p className="text-sm font-semibold text-gray-900 flex-shrink-0">¥{item.product.price * item.quantity}</p>
                      </div>
                    ))}
                    {cartItems.length > 3 && (
                      <p className="text-xs text-gray-400 text-center py-1">
                        {t('orderItemsCount', { count: cartItems.length - 3 })}
                      </p>
                    )}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center bg-gray-50 rounded-b-lg">
                    <span className="text-sm font-semibold text-gray-800">{t('total')}</span>
                    <span className="text-lg font-bold text-red-500">¥{totalPrice}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 汉堡菜单按钮 - 移动端 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-gray-700 hover:text-gray-900 transition-colors"
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
            <Link to="/" onClick={closeMobileMenu} className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors">
              {t('home')}
            </Link>
            <Link to="/products" onClick={closeMobileMenu} className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors">
              {t('allProducts')}
            </Link>
            <Link to="/about" onClick={closeMobileMenu} className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors">
              {t('aboutUs')}
            </Link>
            {user && (
              <Link to="/orders" onClick={closeMobileMenu} className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                {t('myOrders')}
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" onClick={closeMobileMenu} className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                {lang === 'en' ? 'Admin Panel' : '管理后台'}
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;
