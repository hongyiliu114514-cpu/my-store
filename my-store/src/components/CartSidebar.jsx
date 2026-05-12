import { useState } from 'react';

function CartSidebar({ isOpen, onClose, cartItems, totalCount, totalPrice, onChangeQuantity, onSetQuantity, onRemoveItem, onClear, onCheckout }) {
  return (
    <>
      {/* 遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* 购物车侧边栏 */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 max-w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            购物车 ({totalCount})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* 商品列表 */}
        <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4 space-y-3 sm:space-y-4">
          {!cartItems || cartItems.length === 0 ? (
            <p className="text-gray-400 text-center mt-12">购物车是空的</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 items-center border-b border-gray-100 pb-4"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    ¥{item.product.price}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <button
                      onClick={() => onChangeQuantity(item.product.id, -1)}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 text-xs sm:text-sm"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => onSetQuantity(item.product.id, e.target.value)}
                      className="w-10 sm:w-12 h-5 sm:h-6 text-center text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="1"
                      max="99"
                    />
                    <button
                      onClick={() => onChangeQuantity(item.product.id, 1)}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 text-xs sm:text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-800">
                    ¥{item.product.price * item.quantity}
                  </p>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-xs text-red-500 hover:text-red-700 mt-1 font-medium"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 底部总价 */}
        {cartItems && cartItems.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-3 sm:px-5 sm:py-4 space-y-2 sm:space-y-3">
            <div className="flex justify-between text-base font-semibold text-gray-800">
              <span>合计</span>
              <span>¥{totalPrice}</span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-blue-600 text-white py-2.5 rounded hover:bg-blue-700 transition-colors text-sm"
            >
              去结算
            </button>

            <button
              onClick={onClear}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors text-sm"
            >
              清空购物车
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartSidebar;