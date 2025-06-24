'use client';

import useAuthStore from '@/stores/useAuthStore';
import { request } from '@/api/request';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

const LogoutButton = () => {
  const { user, clearUser } = useAuthStore();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await request.post(
        '/v1/user/logout',
        {
          'Content-Type': 'application/json',
        },
        '{}',
        {
          credentials: 'include',
        },
      );
    },
    onSuccess: () => {
      clearUser();
      router.push('/login');
    },
    onError: (error) => {
      // 로그아웃 실패처리
      console.error('로그아웃 실패:', error);
    },
  });

  if (!user) {
    return null; // 로그인하지 않은 경우 버튼을 렌더링하지 않음
  }

  const onClick = async () => {
    if (isPending) return;
    mutate();
  };

  return (
    <Button disabled={isPending} onClick={onClick} variant="ghost" className='px-2 w-full flex justify-start rounded-sm'>
      로그아웃
    </Button>
  );
};

export default LogoutButton;
