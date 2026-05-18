import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import translations from './translations';

const LANG_KEY = 'myStoreLang';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem(LANG_KEY) || 'zh';
  });
  const [showSelector, setShowSelector] = useState(!localStorage.getItem(LANG_KEY));

  const setLang = useCallback((l) => {
    setLangState(l);
    localStorage.setItem(LANG_KEY, l);
    setShowSelector(false);
  }, []);

  const t = useCallback((key, params = {}) => {
    const dict = translations[lang] || translations.zh;
    let text = dict[key];
    if (text === undefined) {
      // fallback to Chinese
      text = translations.zh[key] || key;
    }
    // 替换参数 {xxx}
    if (params && typeof text === 'string') {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  }, [lang]);

  const changeLang = useCallback((l) => {
    setLang(l);
  }, [setLang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, changeLang, t, showSelector, setShowSelector }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export default LanguageContext;
