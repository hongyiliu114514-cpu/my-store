import { useRef } from 'react';
import StarRating from './StarRating';

function getRating(productId) {
  const ratings = [4.5, 4.0, 5.0, 4.8, 4.2, 4.6];
  const counts = [128, 56, 203, 91, 37, 74];
  return {
    rating: ratings[(productId - 1) % ratings.length],
    count: counts[(productId - 1) % counts.length],
  };
}

function ProductDetail({ product, onClose, onAddToCart }) {
  const imgRef = useRef(null);
  if (!product) return null;

  const { rating, count } = getRating(product.id);

  const handleAddToCart = () => {
    const rect = imgRef.current?.getBoundingClientRect();
    onAddToCart(product, rect);
  };

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
        <div className="sticky top-0 bg-white flex justify-end p-3 sm:p-4 pb-0 z-10">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* 内容区 */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <img
            ref={imgRef}
            src={product.image}
            alt={product.name}
            className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-lg mb-4 sm:mb-6"
          />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            {product.name}
          </h2>

          {/* 星级评价 */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <StarRating rating={rating} size="md" />
            <span className="text-xs sm:text-sm text-gray-400">({count}条评价)</span>
          </div>

          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            ¥{product.price}
          </p>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
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
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors active:scale-95"
          >
            加入购物车
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;