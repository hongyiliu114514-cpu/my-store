import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageSelector() {
  const { showSelector, setLang, t } = useLanguage();

  if (!showSelector) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 max-w-sm w-full mx-4 text-center animate-in fade-in zoom-in duration-300">
        {/* 图标 */}
        <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {t('languageSelect')}
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Please choose your preferred language
        </p>

        <div className="space-y-3">
          <button
            onClick={() => setLang('zh')}
            className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-3 group"
          >
            <span className="text-2xl">🇨🇳</span>
            <span className="text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
              {t('chinese')}
            </span>
          </button>

          <button
            onClick={() => setLang('en')}
            className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-3 group"
          >
            <span className="text-2xl">🇺🇸</span>
            <span className="text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
              {t('english')}
            </span>
          </button>
        </div>

        <p className="text-xs text-gray-300 mt-5">
          You can change the language later in settings
        </p>
      </div>
    </div>
  );
}
