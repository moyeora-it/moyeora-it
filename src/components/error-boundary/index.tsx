'use client';

/**
 * 에러 바운더리는 클래스로 구현해야됨
 * 컴포넌트로 구현하면 컴포넌트가 리렌더링 될 때 에러 바운더리가 초기화되지 않음
 */
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: (props: { error: Error | null; resetErrorBoundary: () => void }) => ReactNode;
  onReset?: (error: Error | null) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null }; // 초기 상태
  }

  // 자식 컴포넌트에서 에러 발생 시 상태 업데이트
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  resetErrorBoundary = () => {
    console.log('resetErrorBoundary');
    const {error} = this.state;
    // 에러 상태 초기화
    this.setState({ hasError: false, error: null });
    this.props.onReset?.(error);
  }

   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 여기에 Sentry 등 에러 로깅 서비스 연동 가능
    // 사용하진 않지만 참고용으로 생성 
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  // 에러 발생 시 fallback 컴포넌트 표시
  render() {
    if (this.state.hasError) {
      return this.props.fallback({
        error: this.state.error,
        resetErrorBoundary: this.resetErrorBoundary
      });
    }

    // 에러 없는 경우 자식 컴포넌트 표시
    return this.props.children;
  }
} 