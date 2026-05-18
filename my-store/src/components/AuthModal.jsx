import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function AuthModal({ isOpen, onClose, signIn, signUp }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // 注册时检查密码长度
    if (!isLogin && password.length < 6) {
      setError(t('passwordTooShort'));
      return;
    }

    try {
      if (isLogin) {
        await signIn(email, password, rememberMe);
        onClose();
      } else {
        const data = await signUp(email, password);
        // Supabase 注册成功后会发送确认邮件
        if (data?.user) {
          setSuccessMsg(t('registerSuccess'));
        }
      }
    } catch (err) {
      setError(err.message || t('authFailed'));
    }
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setError('');
    setSuccessMsg('');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-sm sm:max-w-md mx-3 sm:mx-0 rounded-2xl bg-white p-6 sm:p-8 shadow-xl relative">
        {/* 右上角关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
        >
          &times;
        </button>
        <h2 className="mb-4 sm:mb-6 text-center text-xl sm:text-2xl font-bold text-gray-800">
          {isLogin ? t('loginTitle') : t('registerTitle')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              {t('email')}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder={t('emailPlaceholder')}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              {t('password')}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder={t('passwordPlaceholder')}
            />
          </div>

          {/* 记住我 */}
          {isLogin && (
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">{t('rememberMe')}</span>
            </label>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {successMsg && (
            <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
          >
            {isLogin ? t('loginTitle') : t('registerTitle')}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          {isLogin ? t('noAccount') : t('hasAccount')}
          <button
            type="button"
            onClick={toggleMode}
            className="ml-1 font-medium text-blue-600 hover:text-blue-700"
          >
            {isLogin ? t('goRegister') : t('goLogin')}
          </button>
        </p>
      </div>
    </div>
  );
}
