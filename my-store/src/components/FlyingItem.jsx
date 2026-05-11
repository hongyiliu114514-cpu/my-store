import { useEffect, useState } from 'react';

function FlyingItem({ product, startX, startY, endX, endY }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 550);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const dx = endX - startX;
  const dy = endY - startY;

  return (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        left: startX - 16,
        top: startY - 16,
        width: 32,
        height: 32,
        animation: `flyToCart 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
        '--fly-dx': `${dx}px`,
        '--fly-dy': `${dy}px`,
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-8 h-8 rounded-full object-cover shadow-lg border-2 border-white"
      />
      <style>{`
        @keyframes flyToCart {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(calc(var(--fly-dx) * 0.6), calc(var(--fly-dy) * 0.6)) scale(1.3);
            opacity: 0.8;
          }
          100% {
            transform: translate(var(--fly-dx), var(--fly-dy)) scale(0.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default FlyingItem;
