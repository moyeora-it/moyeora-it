'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { request } from '@/api/request';
import useAuthStore from '@/stores/useAuthStore';

/**
 * 회원 탈퇴 모달 컴포넌트
 *
 * @returns 회원 탈퇴 모달 컴포넌트
 */
export const WithdrawDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);

  const withdrawButtonClickHandler = async () => {
    try {
      await request.delete('/v1/user/delete', {
        credentials: 'include',
      });
      toast.success('회원 탈퇴 완료', {
        description: '회원 탈퇴가 완료되었습니다.',
      });
      clearUser();
      router.push('/');
    } catch (error) {
      console.error(error);
      toast.error('회원 탈퇴 실패', {
        description: '회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.',
      });
    }
  };

  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <button type="button" className="text-sm font-medium cursor-pointer text-gray-500 underline underline-offset-3">
            회원 탈퇴
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 탈퇴하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              회원 탈퇴 후 모든 데이터가 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='border-gray-300 text-gray-600'>취소</AlertDialogCancel>
            <AlertDialogAction onClick={withdrawButtonClickHandler}>
              탈퇴
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
