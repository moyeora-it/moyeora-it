import { ErrorFallback } from '@/components/error-fallback';

interface ErrorHandlerProps {
  error: Error | null;
  resetErrorBoundary: () => void;
  defaultMessage?: string;  // 기본 에러 메시지를 커스터마이징 할 수 있음
}
/**
 * 에러 발생 시 처리하는 함수 - fallback 컴포넌트 표시
 * @param param0 
 * @returns 
 */
export const handleError = ({ 
  error, 
  resetErrorBoundary, 
  defaultMessage = '문제가 발생했습니다' 
}: ErrorHandlerProps) => {
  if (error instanceof Error) {
    // 네트워크 에러
    if (error.message.includes('Network')) {
      return (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary}>
          네트워크 연결을 확인해주세요
        </ErrorFallback>
      );
    }
    
    // 인증 에러
    if (error.message.includes('401') || error.message.toLowerCase().includes('unauthorized') || error.message.includes('refresh 만료')) {
      return (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary}>
          로그인이 필요합니다
        </ErrorFallback>
      );
    }
  }
  
  return (
    <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary}>
      {defaultMessage}
    </ErrorFallback>
  );
}; 