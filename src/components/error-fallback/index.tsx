'use client';

import useAuthStore from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { Button } from '../ui/button';

interface ErrorFallbackProps {
  error: Error | null;
  resetErrorBoundary: () => void;
  children: ReactNode;
}

/**
 * 에러 발생 시 fallback되는 컴포넌트
 * @param error 에러 객체
 * @param resetErrorBoundary 에러 재시도 함수
 * @param children 표시할 메시지
 * @returns
 */
export const ErrorFallback = ({
  error,
  resetErrorBoundary,
  children,
}: ErrorFallbackProps) => {
  const { clearUser } = useAuthStore();

  const router = useRouter();

  const handleClick = () => {
    if (
      error?.message.includes('401') ||
      error?.message.toLowerCase().includes('unauthorized') ||
      error?.message.toLowerCase().includes('refresh 만료')
    ) {
      clearUser();
      console.log('401 에러 발생');
      router.push('/login'); // 401 에러면 로그인 페이지로 이동
    } else if (error?.message.includes('Network')) {
      resetErrorBoundary(); // 네트워크 에러면 재시도
    } else {
      resetErrorBoundary(); // 기타 에러는 기본적으로 재시도
    }
  };

  return (
    <div role="alert" className="p-4 flex flex-col items-center mx-auto my-15">
      {/* 에러 메시지 */}
      <p className="text-center text-gray-500">{children}</p>
      {/* 에러 객체가 존재하는 경우 에러 상세 메시지 */}
      {/* {error && <pre className="text-sm">{error.message}</pre>} */}
      {/* resetErrorBoundary이 존재하는 경우 재시도 버튼 */}
      <Button
        onClick={handleClick}
        className="mt-2 text-white text-sm cursor-pointer bg-green-600"
      >
        {error?.message.includes('401') ||
        error?.message.toLowerCase().includes('unauthorized') ||
        error?.message.toLowerCase().includes('refresh 만료')
          ? '로그인하기'
          : '다시 시도'}
      </Button>
    </div>
  );
};
