type StarProps = {
  fillPercent: number;
  width?: number;
  height?: number;
  className?: string;
};

/**
 * 별점 컴포넌트
 * @param fillPercent 채워진 별점 퍼센트
 * @param width 별점 너비
 * @param height 별점 높이
 * @param className 별점 클래스명
 * @returns 별점 컴포넌트
 */
export const Star: React.FC<StarProps> = ({ fillPercent, width = 50, height = 50, className }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 50 50" 
    className={className}
  >
    <defs>
      <linearGradient id={`star-fill-${fillPercent}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset={`${fillPercent}%`} stopColor="#FFD700" />
        <stop offset={`${fillPercent}%`} stopColor="#E0E0E0" />
        <stop offset="100%" stopColor="#E0E0E0" />
      </linearGradient>
    </defs>
    <polygon
      points="25,2 32,18 49,18 35,28 40,45 25,35 10,45 15,28 1,18 18,18"
      fill={`url(#star-fill-${fillPercent})`}
    />
  </svg>
);
