function Hero({ onScrollToProducts }) {
  return (
    <section className="relative bg-gray-900 text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10" />
      <div
        className="h-[70vh] min-h-[500px] bg-cover bg-center"
        style={{ backgroundImage: "url('https://placehold.co/1920x1080/1e293b/f8fafc?text=New+Collection')" }}
      />
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            新品上市
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-lg">
            探索我们的独家系列
          </p>
          <button
            onClick={onScrollToProducts}
            className="bg-white text-gray-900 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            立即购买
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;