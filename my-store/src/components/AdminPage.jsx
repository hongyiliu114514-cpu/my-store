import { useState, useEffect, useCallback, useRef } from 'react';
import supabase from '../supabaseClient';
import { useLanguage } from '../i18n/LanguageContext';

const adminEmails = (import.meta.env.VITE_ADMIN_EMAIL || '').split(',').map(e => e.trim()).filter(Boolean);

const statusColors = {
  '待处理': 'bg-yellow-100 text-yellow-800',
  '已发货': 'bg-blue-100 text-blue-800',
  '已完成': 'bg-green-100 text-green-800',
};

const statusKeyMap = {
  '待处理': 'statusPending',
  '已发货': 'statusShipped',
  '已完成': 'statusCompleted',
};

const FILTERS = [
  { key: 'all', labelKey: 'all' },
  { key: '待处理', labelKey: 'statusPending' },
  { key: '已发货', labelKey: 'statusShipped' },
  { key: '已完成', labelKey: 'statusCompleted' },
];

function OrderRow({ order, t, lang, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemsError, setItemsError] = useState('');
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!expanded) {
      loadedRef.current = false;
      setItems([]);
      setItemsError('');
      return;
    }
    if (loadedRef.current) return;

    let cancelled = false;
    const fetchItems = async () => {
      setLoadingItems(true);
      setItemsError('');
      try {
        const { data, error } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id)
          .order('id', { ascending: true });
        if (cancelled) return;
        if (error) throw error;
        setItems(data || []);
        loadedRef.current = true;
      } catch {
        if (!cancelled) setItemsError(t('orderLoadFailed'));
      } finally {
        if (!cancelled) setLoadingItems(false);
      }
    };
    fetchItems();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  const statusLabel = statusKeyMap[order.status] ? t(statusKeyMap[order.status]) : order.status;
  const isDone = order.status === '已完成';
  const userIdShort = order.user_id ? order.user_id.substring(0, 8) : '—';

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const handleStatusChange = (newStatus) => {
    const statusLabel = statusKeyMap[newStatus] ? t(statusKeyMap[newStatus]) : newStatus;
    const confirmMsg = lang === 'en'
      ? `Confirm marking order #${order.id} as "${statusLabel}"?`
      : `确认将订单 #${order.id} 标记为"${statusLabel}"吗？`;
    if (window.confirm(confirmMsg)) {
      onStatusChange(order.id, newStatus);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all">
      {/* 订单头部 - 可点击展开 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-3 sm:px-5 py-3 sm:py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
            <span className="text-xs text-gray-400 font-mono flex-shrink-0">
              #{order.id}
            </span>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
              {statusLabel}
            </span>
            <span className="text-xs text-gray-400 truncate">
              {t('receiver')}: {order.name || '—'}
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
            <span className="text-sm sm:text-base font-bold text-red-500 flex-shrink-0">
              ¥{order.total_price}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* 订单基本信息 */}
        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-400">
          <span>UID: {userIdShort}</span>
          <span>{order.phone || '—'}</span>
          <span>{formatDate(order.created_at)}</span>
        </div>
      </button>

      {/* 展开区：商品明细 + 操作按钮 */}
      {expanded && (
        <div className="border-t border-gray-100 px-3 sm:px-5 py-3 bg-gray-50">
          {/* 地址信息 */}
          {order.address && (
            <p className="text-xs text-gray-400 mb-3">
              {t('address')}: {order.address}
            </p>
          )}

          {/* 商品明细 */}
          <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">{t('orderItems')}</h4>

          {loadingItems && (
            <p className="text-xs text-gray-400 py-2">{t('orderLoadingItems')}</p>
          )}
          {itemsError && (
            <p className="text-xs text-red-500 py-2">{itemsError}</p>
          )}
          {!loadingItems && !itemsError && items.length === 0 && (
            <p className="text-xs text-gray-400 py-2">{t('orderNoItems')}</p>
          )}
          {!loadingItems && items.length > 0 && (
            <div className="space-y-2 mb-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-800 truncate flex-1 min-w-0">{item.product_name}</span>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-3">
                    <span className="text-gray-500">¥{item.price} × {item.quantity}</span>
                    <span className="text-gray-900 font-medium w-16 text-right">¥{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 操作按钮 */}
          {!isDone && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
              {order.status !== '已发货' && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleStatusChange('已发货'); }}
                  className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {lang === 'en' ? 'Mark Shipped' : '标记已发货'}
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); handleStatusChange('已完成'); }}
                className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                {lang === 'en' ? 'Mark Completed' : '标记已完成'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminPage({ user, onBack }) {
  const { t, lang } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  // 权限检查
  if (!user || !adminEmails.includes(user.email)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 max-w-md w-full text-center">
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">无权访问</h1>
          <p className="text-gray-500 text-sm mb-6">您没有管理员权限，无法访问此页面。</p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {t('backToHome')}
          </button>
        </div>
      </div>
    );
  }

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (!supabase) {
        setError(t('dbNotConfigured'));
        setLoading(false);
        return;
      }
      const { data, error: queryError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;
      setOrders(data || []);
    } catch (err) {
      setError(err.message || t('orderLoadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (updateError) throw updateError;
      // 刷新列表
      await fetchOrders();
    } catch (err) {
      alert('状态更新失败: ' + (err.message || '未知错误'));
    }
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">{t('backToHome')}</span>
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">订单管理</h1>
          </div>
          <span className="text-xs text-gray-400 hidden sm:inline truncate max-w-[200px]">
            {user.email}
          </span>
        </div>
      </div>

      {/* 状态筛选栏 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                filter === f.key
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {f.key === 'all' ? t(f.labelKey) : t(f.labelKey)}
            </button>
          ))}
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-400 text-sm mt-3">{t('loading')}</p>
          </div>
        )}

        {/* 错误 */}
        {error && !loading && (
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-500 text-base mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              重新加载
            </button>
          </div>
        )}

        {/* 空状态 */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-400 text-base">{t('noOrders')}</p>
          </div>
        )}

        {/* 订单列表 */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="space-y-3 sm:space-y-4 pb-8">
            <div className="text-xs text-gray-400 mb-1">
              共 {filteredOrders.length} 条订单
            </div>
            {filteredOrders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                t={t}
                lang={lang}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
