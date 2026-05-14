import { useState, useEffect, useRef } from 'react';
import supabase from '../supabaseClient';

function OrderCard({ order, isExpanded, onToggle }) {
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemsError, setItemsError] = useState('');
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!isExpanded || hasLoadedRef.current) return;

    const fetchItems = async () => {
      setLoadingItems(true);
      setItemsError('');
      try {
        if (!supabase) {
          setItemsError('数据库未配置');
          return;
        }
        const { data, error } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id)
          .order('id', { ascending: true });

        if (error) throw error;
        setItems(data || []);
        hasLoadedRef.current = true;
      } catch (err) {
        setItemsError('加载商品明细失败');
        console.error('加载订单商品失败:', err);
      } finally {
        setLoadingItems(false);
      }
    };

    fetchItems();
  }, [isExpanded, order.id]);

  const statusColors = {
    '待处理': 'bg-yellow-100 text-yellow-800',
    '处理中': 'bg-blue-100 text-blue-800',
    '已发货': 'bg-purple-100 text-purple-800',
    '已完成': 'bg-green-100 text-green-800',
    '已取消': 'bg-gray-100 text-gray-600',
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200">
      {/* 订单头部 */}
      <button
        onClick={onToggle}
        className="w-full text-left px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-gray-50 transition-colors"
      >
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs text-gray-400 font-mono">
            订单号: {order.id}
          </span>
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
            {order.status}
          </span>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
          <span className="text-sm sm:text-base font-bold text-red-500">
            ¥{order.total_price}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* 订单基本信息 */}
      <div className="px-4 sm:px-6 pb-3 flex flex-wrap gap-x-6 gap-y-1 text-xs sm:text-sm text-gray-500">
        <span>收货人: {order.name}</span>
        <span className="truncate max-w-[200px] sm:max-w-xs">地址: {order.address}</span>
        <span>下单时间: {formatDate(order.created_at)}</span>
      </div>

      {/* 展开的商品明细 */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-4 sm:px-6 py-3 bg-gray-50">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">商品明细</h4>

          {loadingItems && (
            <p className="text-xs text-gray-400 py-2">加载中...</p>
          )}

          {itemsError && (
            <p className="text-xs text-red-500 py-2">{itemsError}</p>
          )}

          {!loadingItems && !itemsError && items.length === 0 && (
            <p className="text-xs text-gray-400 py-2">暂无商品数据</p>
          )}

          {!loadingItems && items.length > 0 && (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex-1 min-w-0">
                    <span className="text-gray-800 truncate block">{item.product_name}</span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 ml-3">
                    <span className="text-gray-500">¥{item.price} × {item.quantity}</span>
                    <span className="text-gray-900 font-medium w-16 text-right">
                      ¥{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-200 mt-3 pt-2 flex justify-end">
            <span className="text-xs sm:text-sm text-gray-500">
              共 {items.length} 件商品
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function PageHeader({ onBack }) {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center">
        <button
          onClick={() => onBack?.()}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">返回</span>
        </button>
        <h1 className="ml-4 text-lg sm:text-xl font-bold text-gray-900">我的订单</h1>
      </div>
    </div>
  );
}

export default function OrderHistory({ user, onBack, onLoginClick }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (!supabase) {
      setError('数据库未配置');
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const { data, error: queryError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (queryError) throw queryError;
        setOrders(data || []);
      } catch (err) {
        setError('加载失败，请重试');
        console.error('加载订单失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const toggleExpand = (orderId) => {
    setExpandedId((prev) => (prev === orderId ? null : orderId));
  };

  // 未登录状态
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader onBack={onBack} />

        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-base mb-6">请先登录查看订单</p>
          <button
            onClick={() => onLoginClick?.()}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            去登录
          </button>
        </div>
      </div>
    );
  }

  // 已登录状态
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader onBack={onBack} />

      {/* 订单列表 */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-400 text-sm mt-3">加载中...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-500 text-base mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              重新加载
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-400 text-base">暂无订单记录</p>
            <button
              onClick={onBack}
              className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              去逛逛
            </button>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isExpanded={expandedId === order.id}
                onToggle={() => toggleExpand(order.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
