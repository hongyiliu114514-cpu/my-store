import { useLanguage } from '../i18n/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-white">
      {/* 顶部大图 */}
      <section className="relative w-full h-48 sm:h-64 lg:h-80 overflow-hidden">
        <img
          src="https://placehold.co/1920x600/1e293b/f8fafc?text=ABOUT+MYSTORE"
          alt={t('aboutTitle')}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-wider">
            {t('aboutTitle')}
          </h1>
        </div>
      </section>

      {/* 品牌故事 */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{t('ourStory')}</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full" />
        </div>

        <div className="prose prose-sm sm:prose-base max-w-none text-gray-600 space-y-5 leading-relaxed">
          <p>{t('aboutStory1')}</p>
          <p>{t('aboutStory2')}</p>
          <p>{t('aboutStory3')}</p>
        </div>
      </section>

      {/* 品牌理念 */}
      <section className="bg-gray-50 py-10 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{t('brandPhilosophy')}</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('qualityAssurance')}</h3>
              <p className="text-sm text-gray-500">{t('qualityDesc')}</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('fastResponse')}</h3>
              <p className="text-sm text-gray-500">{t('fastResponseDesc')}</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dedicatedService')}</h3>
              <p className="text-sm text-gray-500">{t('dedicatedServiceDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 底部占位大图 */}
      <section className="w-full h-40 sm:h-56 overflow-hidden">
        <img
          src="https://placehold.co/1920x400/0f172a/f8fafc?text=JOIN+US+TODAY"
          alt={t('joinUs')}
          className="w-full h-full object-cover"
        />
      </section>
    </div>
  );
}
