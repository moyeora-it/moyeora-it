import { Star } from '@/components/atoms/star';
import React, { useRef, useState } from 'react';

interface StarRatingProps {
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  maxRating?: number;
}

/**
 * 별점 컴포넌트 5점 기준
 * @param initialRating 초기 별점
 * @param onRatingChange 별점 변경 시 콜백
 * @param readOnly 읽기 전용 여부
 * @param maxRating 최대 별점
 * @returns 별점 컴포넌트
 */
export const StarRating: React.FC<StarRatingProps> = ({
  initialRating = 0,
  onRatingChange,
  readOnly = false,
  maxRating = 5,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null); //별점 컨테이너

  const calculateRating = (clientX: number) => {
    if (!containerRef.current) return undefined;

    const { left, width } = containerRef.current.getBoundingClientRect(); //별점 컨테이너의 위치와 너비를 가져옴, width는 별점 컨테이너의 너비
    const x = Math.max(0, Math.min(width, clientX - left)); //현재 마우스 위치값 0~100
    return Math.round((x / width) * maxRating * 10) / 10; //별점 컨테이너의 너비에 따른 별점 계산
  };

  const mouseDownHandler = (e: React.MouseEvent) => {
    setIsDragging(true);
    const newRating = calculateRating(e.clientX);
    if (newRating !== undefined) {
      setRating(Math.min(maxRating, Math.max(0, newRating)));
      onRatingChange?.(Math.min(maxRating, Math.max(0, newRating)));
    }
  };

  const mouseMoveHandler = (e: React.MouseEvent) => {
    if (isDragging) {
      const newRating = calculateRating(e.clientX);
      if (newRating !== undefined) {
        setRating(Math.min(maxRating, Math.max(0, newRating)));
        onRatingChange?.(Math.min(maxRating, Math.max(0, newRating)));
      }
    }
  };

  const mouseUpHandler = () => {
    setIsDragging(false);
  };

  const mouseLeaveHandler = () => {
    setIsDragging(false);
  };

  const eventHandlers = readOnly
    ? {}
    : {
        onMouseDown: mouseDownHandler,
        onMouseMove: mouseMoveHandler,
        onMouseUp: mouseUpHandler,
        onMouseLeave: mouseLeaveHandler,
      };

  return (
    <div className="flex items-center flex-col">
      <div
        ref={containerRef}
        className={`flex gap-2 ${
          readOnly ? 'cursor-default' : 'cursor-pointer'
        }`}
        {...eventHandlers}
      >
        {[...Array(maxRating)].map((_, i) => {
          const fillPercent = (() => {
            if (rating <= i) return 0;
            if (rating >= i + 1) return 100;
            return (rating - i) * 100;
          })();
          return <Star key={i} className="w-8 h-8" fillPercent={fillPercent} />;
        })}
      </div>
      <span className="ml-2">
        {rating.toFixed(1)} / {maxRating}
      </span>
    </div>
  );
};
