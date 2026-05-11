function StarRating({ rating, size = 'sm' }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const adjustedFull = rating - fullStars >= 0.75 ? fullStars + 1 : fullStars;

  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  for (let i = 1; i <= 5; i++) {
    if (i <= adjustedFull) {
      // 满星
      stars.push(
        <svg key={i} className={`${sizeClass} text-yellow-400`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    } else if (i === adjustedFull + 1 && hasHalf) {
      // 半星
      stars.push(
        <svg key={i} className={`${sizeClass} text-yellow-400`} viewBox="0 0 24 24">
          <defs>
            <linearGradient id={`half-${i}-${rating}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#d1d5db" />
            </linearGradient>
          </defs>
          <path fill={`url(#half-${i}-${rating})`} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    } else {
      // 空星
      stars.push(
        <svg key={i} className={`${sizeClass} text-gray-300`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      {stars}
      <span className="ml-1 text-sm font-semibold text-gray-700">{rating}</span>
    </div>
  );
}

export default StarRating;
