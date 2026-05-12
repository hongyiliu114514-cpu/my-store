import { useState, useEffect, useRef } from 'react';

// 倒计时目标：距离今天 +3 天 00:00:00
function getTargetDate() {
  const now = new Date();
  const target = new Date(now);
  target.setDate(target.getDate() + 3);
  target.setHours(0, 0, 0, 0);
  return target;
}

function CountdownBanner() {
  const endTimeRef = useRef(getTargetDate().getTime());
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = endTimeRef.current - Date.now();
    return diff > 0 ? diff : 0;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = endTimeRef.current - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

  const pad = (n) => String(n).padStart(2, '0');

  if (timeLeft <= 0) return null;

  return (
    <div className="fixed top-16 sm:top-20 right-2 sm:right-4 z-40 w-28 sm:w-36 lg:w-40 h-24 sm:h-28 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-lg sm:rounded-xl shadow-xl sm:shadow-2xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 p-1.5 sm:p-2">
      {/* 时钟图标 + 标题 */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 animate-pulse shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="font-bold text-[10px] sm:text-xs leading-tight text-center">限时折扣</span>

      {/* 倒计时数字 */}
      <div className="flex items-center gap-0.5">
        {days > 0 && (
          <>
            <span className="bg-white/20 rounded px-0.5 sm:px-1 py-0.5 font-mono font-bold text-xs sm:text-sm">{pad(days)}</span>
            <span className="text-[9px] sm:text-[10px]">天</span>
          </>
        )}
        <span className="bg-white/20 rounded px-0.5 sm:px-1 py-0.5 font-mono font-bold text-xs sm:text-sm">{pad(hours)}</span>
        <span className="text-[9px] sm:text-[10px] font-bold">:</span>
        <span className="bg-white/20 rounded px-0.5 sm:px-1 py-0.5 font-mono font-bold text-xs sm:text-sm">{pad(minutes)}</span>
        <span className="text-[9px] sm:text-[10px] font-bold">:</span>
        <span className="bg-white/20 rounded px-0.5 sm:px-1 py-0.5 font-mono font-bold text-xs sm:text-sm">{pad(seconds)}</span>
      </div>

      {/* 折扣标签 */}
      <span className="text-[9px] sm:text-[10px] lg:text-xs bg-white/20 rounded-full px-1.5 sm:px-2 py-0.5 font-semibold animate-pulse">
        🔥 全场低至5折
      </span>
    </div>
  );
}

export default CountdownBanner;
