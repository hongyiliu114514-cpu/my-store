export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 顶部大图 */}
      <section className="relative w-full h-48 sm:h-64 lg:h-80 overflow-hidden">
        <img
          src="https://placehold.co/1920x600/1e293b/f8fafc?text=ABOUT+MYSTORE"
          alt="关于 MYSTORE"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-wider">
            关于 MYSTORE
          </h1>
        </div>
      </section>

      {/* 品牌故事 */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">我们的故事</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full" />
        </div>

        <div className="prose prose-sm sm:prose-base max-w-none text-gray-600 space-y-5 leading-relaxed">
          <p>
            MYSTORE 诞生于对品质生活的无限热爱。我们相信，每一件商品都承载着设计师的匠心与消费者的期待。
            从创立之初，我们就致力于为每一位顾客提供精心甄选的优质商品，让购物不再只是交易，更是一种愉悦的生活体验。
          </p>
          <p>
            我们的团队走遍世界各地，从潮流前沿到匠心工坊，只为发现那些兼具美感与实用性的好物。
            无论是日常必需品还是独特的设计单品，我们都以严苛的标准进行筛选，确保每一件上架的商品都经得起时间的考验。
          </p>
          <p>
            MYSTORE 不仅是一个购物平台，更是一个连接美好事物与懂生活的人的桥梁。
            我们希望通过用心的服务、透明的价格和持续的创新，成为您生活中值得信赖的伙伴。
          </p>
        </div>
      </section>

      {/* 品牌理念 */}
      <section className="bg-gray-50 py-10 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">品牌理念</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">品质保证</h3>
              <p className="text-sm text-gray-500">严格筛选每一件商品，确保品质卓越，让您买得放心。</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">快速响应</h3>
              <p className="text-sm text-gray-500">高效的物流体系与贴心的客服团队，让每一次购物都顺畅无忧。</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">用心服务</h3>
              <p className="text-sm text-gray-500">以客户为中心，持续优化体验，让 MYSTORE 成为您的首选。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 底部占位大图 */}
      <section className="w-full h-40 sm:h-56 overflow-hidden">
        <img
          src="https://placehold.co/1920x400/0f172a/f8fafc?text=JOIN+US+TODAY"
          alt="加入我们"
          className="w-full h-full object-cover"
        />
      </section>
    </div>
  );
}
