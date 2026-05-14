import { useState } from 'react';

export default function CheckoutPage({ cartItems, totalPrice, user, onSubmit, onBack, onLoginClick }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 未登录用户拦截
    if (!user) {
      setError('请先登录后再提交订单');
      return;
    }

    if (!name.trim()) {
      setError('请输入收货人姓名');
      return;
    }
    if (!phone.trim()) {
      setError('请输入手机号');
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
      setError('手机号格式不正确');
      return;
    }
    if (!address.trim()) {
      setError('请输入详细地址');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), phone: phone.trim(), address: address.trim() });
    } catch (err) {
      setError(err.message || '提交失败，请重试');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">返回首页</span>
          </button>
          <h1 className="ml-4 text-lg sm:text-xl font-bold text-gray-900">确认订单</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* 未登录警告 */}
        {!user && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-300 px-4 py-3 text-sm text-red-700 flex items-center justify-between flex-wrap gap-2">
            <span>
              <span className="font-semibold">⚠ 未登录：</span>
              请先登录后再提交订单。
            </span>
            <button
              type="button"
              onClick={onLoginClick}
              className="px-4 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors flex-shrink-0"
            >
              去登录
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* 左侧：收货信息表单 */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                收货信息
              </h2>

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    收货人姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="请输入收货人姓名"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    手机号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="请输入手机号"
                    maxLength={11}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    详细地址 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="省/市/区/街道/门牌号"
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                  />
                </div>

                {error && (
                  <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                    {error}
                  </p>
                )}

                {/* 移动端：提交按钮在表单底部 */}
                <div className="lg:hidden">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? '提交中...' : `提交订单 ¥${totalPrice}`}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* 右侧：订单清单 */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:sticky lg:top-20">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                订单清单 ({cartItems.length}件)
              </h2>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-3 items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ¥{item.product.price} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                      ¥{item.product.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between text-base font-semibold text-gray-900">
                  <span>合计</span>
                  <span className="text-red-500">¥{totalPrice}</span>
                </div>
              </div>

              {/* 桌面端：提交按钮在清单底部 */}
              <div className="hidden lg:block mt-4">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? '提交中...' : '提交订单'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
