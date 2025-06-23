'use client';

import { LoginRequireButton } from '@/components/atoms/login-require-button';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/stores/useAuthStore';
import { routes } from '@/utils/routes';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const WriteGroupButton = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const writeButtonClickHandler = () => {
    if (!user) {
      router.push(routes.login);
      return;
    }

    router.push(routes.write);
  };

  return (
    <div className="fixed md:absolute bottom-0 md:top-0 md:bottom-auto right-0 my-6 z-10">
      <Button
        onClick={writeButtonClickHandler}
        className="cursor-pointer rounded-[50%] md:hidden"
      >
        <PlusIcon />
      </Button>
      <LoginRequireButton
        onClick={writeButtonClickHandler}
        className="hidden md:block cursor-pointer"
      >
        만들기
      </LoginRequireButton>
    </div>
  );
};
