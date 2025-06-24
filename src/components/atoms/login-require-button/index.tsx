'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import useAuthStore from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type LoginRequireButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

export const LoginRequireButton = ({
  children,
  onClick,
  disabled = false,
  className = '',
}: LoginRequireButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const LoginRequireButtonClickHandler = () => {
    if (!user) {
      setIsOpen(true); // 로그인 모달 열기
    } else {
      onClick(); // 로그인 상태면 원래 동작 수행
    }
  };

  return (
    <>
      <Button
        onClick={LoginRequireButtonClickHandler}
        disabled={disabled}
        className={`cursor-pointer ${className}`}
      >
        {children}
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-90 max-h-[90vh] p-10">
          <DialogTitle className="text-center font-normal pt-2">
            로그인이 필요한 서비스입니다
          </DialogTitle>
          <DialogDescription className="sr-only">
            해당 기능을 사용하려면 먼저 로그인해 주세요.
          </DialogDescription>
          <DialogFooter className="mt-5">
            <Button
              onClick={() => router.push('/login')}
              className="cursor-pointer"
            >
              로그인하러 가기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
