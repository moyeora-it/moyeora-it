'use client';

import { useParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/api/request';
import { toast } from 'sonner';

export const useRemoveFollower = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();
  const { id } = useParams();

  return useMutation({
    mutationFn() {
      return request.delete(`/v1/follow/${userId}/unfollower`, {
        credentials: 'include',
      });
    },
    onError() {
      toast.error('팔로워 삭제 실패', {
        description: '팔로워 삭제에 실패했어요. 잠시 후 다시 시도해주세요.',
      });
    },
    onSettled() {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['items', `/v1/follow/${id}/followers`],
        }),
        queryClient.invalidateQueries({
          queryKey: ['user', id, 'followers count'],
        }),
      ]);
    },
  });
};
