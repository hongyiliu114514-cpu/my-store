import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const STORAGE_KEY = 'myStoreAnnouncementDismissed';

function AnnouncementBadge({ version, content }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // 检查是否已关闭（不再提醒）
  useEffect(() => {
    try {
      const dismissedVersion = localStorage.getItem(STORAGE_KEY);
      if (dismissedVersion && parseInt(dismissedVersion, 10) >= version) {
        setDismissed(true);
      }
    } catch { /* ignore */ }
  }, [version]);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(version));
    } catch { /* ignore */ }
    setDismissed(true);
    setExpanded(false);
  };

  if (dismissed) return null;

  const hasContent = content && content.length > 0;

  return (
    <>
      {/* 折叠态：左下角小徽标 */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="fixed bottom-4 left-4 z-[9998] flex items-center gap-1.5 px-2.5 py-1.5 
                     bg-white/60 backdrop-blur-md rounded-full shadow-sm 
                     border border-gray-200/50 text-gray-500 hover:text-gray-700 
                     hover:bg-white/80 transition-all duration-200"
          title="查看公告"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <span className="text-[11px] font-medium tracking-wide">{t('announcementTitle')}</span>
        </button>
      )}

      {/* 展开态：左下角小卡片 */}
      {expanded && (
        <div className="fixed bottom-4 left-4 z-[9998] w-56 
                        bg-white/70 backdrop-blur-lg rounded-xl shadow-lg 
                        border border-gray-200/60 overflow-hidden
                        animate-in slide-in-from-left-2 fade-in duration-200">
          {/* 头部 */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100/60">
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <span className="text-[11px] font-semibold text-gray-600 tracking-wide">{t('announcementTitle')}</span>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 内容 */}
          <div className="px-3 py-2 max-h-32 overflow-y-auto">
            {hasContent ? (
              <ul className="space-y-1">
                {content.map((line, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-500 leading-relaxed">
                    <span className="text-gray-300 mt-0.5 shrink-0">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[11px] text-gray-400 text-center py-3">{t('noData')}</p>
            )}
          </div>

          {/* 底部关闭按钮 */}
          <div className="px-3 py-1.5 border-t border-gray-100/60">
            <button
              onClick={handleDismiss}
              className="w-full text-[10px] text-gray-400 hover:text-gray-600 transition-colors py-0.5"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AnnouncementBadge;
