import { useState, useMemo } from 'react';
import ProductDetail from './ProductDetail';

function ProductList({ products, onAddToCart, sectionRef }) {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [detailProduct, setDetailProduct] = useState(null);

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
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            {/* 图片容器：改好了固定宽度，完美居中 */}
            <div 
              className="w-56 h-56 mx-auto mt-5 overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-105"
              onClick={() => setDetailProduct(product)}
            >
              <img
  src={product.image}
  alt={product.name}
/>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-xs text-gray-400">
                  已售{product.sales >= 100 ? '99+' : product.sales}件
                </span>
                <span className="text-xl font-bold text-gray-900">
                  ¥{product.price}
                </span>
              </div>
              <button
                onClick={() => onAddToCart(product)}
                className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                加入购物车
              </button>
            </div>
          </div>
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