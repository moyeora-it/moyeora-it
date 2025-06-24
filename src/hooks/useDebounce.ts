import { useCallback, useEffect, useRef } from 'react';

/**
 * 디바운스 훅
 * 
 * @param callback 호출할 함수
 * @param delay 지연 시간
 * @returns 디바운스된 콜백 함수
 */

export const useDebounce = <T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );

  return debouncedCallback;
};
