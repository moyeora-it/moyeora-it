'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useAuthStore from '@/stores/useAuthStore';

type ClientAuthGuardProps = {
  children: React.ReactNode;
};

export default function ClientAuthGuard({ children }: ClientAuthGuardProps) {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
    // eslint-disable-next-line
  }, [user]);

  return <>{children}</>;
}
