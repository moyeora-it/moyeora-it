'use client';

import { useRouter } from 'next/navigation';
import { startTransition } from 'react';
import { handleError } from '@/components/error-boundary/error-handler';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  return handleError({
    error,
    resetErrorBoundary: () => {
      router.refresh();
      startTransition(() => {
        reset();
      });
    },
  });
}
