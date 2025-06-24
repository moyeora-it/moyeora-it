'use client';

import { ErrorFallback } from '@/components/error-fallback';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <ErrorFallback error={error} resetErrorBoundary={reset}>
      팔로워 목록을 불러오는 데 실패했어요.
      <br />
      잠시 후 다시 시도해주세요.
    </ErrorFallback>
  );
}
