function CartSidebar({ isOpen, onClose, cartItems, totalCount, totalPrice, onChangeQuantity, onRemoveItem, onClear }) {
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
        className={`fixed top-0 right-0 h-full w-96 max-w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
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
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
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
                  className="w-16 h-16 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    ¥{item.product.price}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => onChangeQuantity(item.product.id, -1)}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 text-sm"
                    >
                      −
                    </button>
                    <span className="text-sm w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onChangeQuantity(item.product.id, 1)}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 text-sm"
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
                    className="text-xs text-red-400 hover:text-red-600 mt-1"
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
          <div className="border-t border-gray-200 px-5 py-4 space-y-3">
            <div className="flex justify-between text-base font-semibold text-gray-800">
              <span>合计</span>
              <span>¥{totalPrice}</span>
            </div>
            <button className="w-full bg-gray-900 text-white py-2.5 rounded hover:bg-gray-800 transition-colors text-sm">
              去结算
            </button>
            <button
              onClick={onClear}
              className="w-full border border-gray-300 text-gray-600 py-2 rounded hover:bg-gray-50 transition-colors text-sm"
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