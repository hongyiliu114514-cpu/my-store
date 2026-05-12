import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'myStoreAnnouncementDismissed';

function AnnouncementModal({ version, content }) {
  const [visible, setVisible] = useState(false);
  const [dontRemind, setDontRemind] = useState(false);

  useEffect(() => {
    if (!content || content.length === 0) return;

    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      const dismissedVersion = dismissed ? parseInt(dismissed, 10) : 0;
      if (dismissedVersion >= version) return;
    } catch {
      // localStorage 不可用时仍然显示
    }

    // 延迟弹出，让页面先渲染
    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, [version, content]);

  const handleClose = useCallback(() => {
    setVisible(false);
    if (dontRemind) {
      try {
        localStorage.setItem(STORAGE_KEY, String(version));
      } catch { /* 静默失败 */ }
    }
  }, [dontRemind, version]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* 半透明虚化背景 */}
      <div
        className="absolute inset-0 bg-white/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* 中央长方形内容区 */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* 右上角关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
        >
          &times;
        </button>
        {/* 顶部白色品牌条 */}
        <div className="bg-white px-6 pt-6 pb-4 text-center">
          <h2 className="text-2xl font-bold tracking-wider text-gray-900">
            MYSTORE
          </h2>
          <div className="mt-3 border-b border-gray-200" />
        </div>

        {/* 公告内容区 */}
        <div className="px-6 pb-4">
          {content.length > 0 ? (
            <ul className="space-y-2 text-gray-700 text-sm leading-relaxed">
              {content.map((line, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5 shrink-0">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm text-center py-4">
              暂无公告
            </p>
          )}
        </div>

        {/* 底部：不再提醒 + 关闭按钮 */}
        <div className="px-6 pb-5 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontRemind}
              onChange={(e) => setDontRemind(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400 cursor-pointer"
            />
            <span className="text-xs text-gray-400">不再提醒</span>
          </label>
          <button
            onClick={handleClose}
            className="px-5 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
          >
            知道了
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementModal;
