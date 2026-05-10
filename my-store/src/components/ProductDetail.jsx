function ProductDetail({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <div className="sticky top-0 bg-white flex justify-end p-4 pb-0 z-10">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* 内容区 */}
        <div className="px-6 pb-6">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-80 object-cover rounded-lg mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {product.name}
          </h2>
          <p className="text-3xl font-bold text-gray-900 mb-4">
            ¥{product.price}
          </p>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* 商品详情列表 */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">商品详情</h3>
            <ul className="space-y-2">
              {product.details?.map((detail, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <span className="text-gray-400 mt-1">•</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-gray-900 text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
          >
            加入购物车
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;