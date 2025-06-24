'use client';

import { request } from '@/api/request';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const CancelGroupButton = () => {
  const router = useRouter();
  const { groupId } = useParams<{ groupId: string }>();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      request.delete(`/v2/groups/${groupId}`, { credentials: 'include' }),
    onError: () => {
      toast.error('모임 취소에 실패하였습니다. 잠시 후 다시 시도해주세요.');
    },
    onSuccess: () => {
      router.push('/');
      toast.success('모임이 취소되었습니다.');
    },
  });

  const cancelGroupHandler = () => {
    mutate();
  };

  return (
    <Button
      onClick={cancelGroupHandler}
      disabled={isPending}
      className="cursor-pointer"
    >
      모임 취소
    </Button>
  );
};
