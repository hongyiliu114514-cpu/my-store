export default function OrderSuccessPage({ orderId, onContinueShopping }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 max-w-md w-full text-center">
        {/* 绿色勾号 */}
        <div className="mx-auto mb-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 sm:h-12 sm:w-12 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          下单成功！
        </h1>

        <p className="text-gray-500 mb-2 text-sm sm:text-base">
          感谢您的购买，订单已提交成功。
        </p>

        <div className="inline-block bg-gray-50 rounded-lg px-4 py-2 mb-6">
          <span className="text-xs text-gray-400">订单号</span>
          <p className="text-lg sm:text-xl font-mono font-bold text-gray-900">
            {orderId}
          </p>
        </div>

        <p className="text-xs sm:text-sm text-gray-400 mb-8">
          我们将尽快为您处理订单，请留意物流信息。
        </p>

        <button
          onClick={onContinueShopping}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors active:scale-95"
        >
          继续购物
        </button>
      </div>
    </div>
  );
}
