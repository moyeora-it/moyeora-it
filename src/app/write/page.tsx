'use client';

import { WriteForm } from '@/components/organisms/write-form';
import useIsClient from '@/hooks/useIsClient';
import useAuthStore from '@/stores/useAuthStore';
import { routes } from '@/utils/routes';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const isClient = useIsClient();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // 브라우저 경고창을 띄우기 위한 트리거
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (!isClient) return null;

  if (!user) {
    router.push(routes.login);

    return;
  }

  return (
    <div className="relative w-[300px] sm:w-[370px] md:w-[740px] m-auto mb-10">
      <WriteForm />
    </div>
  );
}
