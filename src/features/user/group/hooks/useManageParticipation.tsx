import { useMutation } from '@tanstack/react-query';
import { request } from '@/api/request';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

/**
 * 사용자의 모임 참가를 관리하는 커스텀 훅
 *
 * 모임 참가 요청 승인 및 거절 처리
 *
 * @returns useMutation 훅 반환값
 */
export const useManageParticipation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn({
      groupId,
      userId,
      status,
    }: {
      groupId: string;
      userId: string;
      status: 'approve' | 'deny';
    }) {
      return request.post(
        `/v2/groups/${groupId}/join`,
        {
          'Content-Type': 'application/json',
        },
        JSON.stringify({
          userId: Number(userId),
          status,
        }),
        {
          credentials: 'include',
        },
      );
    },
    onSuccess() {
      return queryClient.invalidateQueries({
        queryKey: ['group-member-list'],
      });
    },
    onError(error) {
      const errMessage = JSON.parse(error.message.split('-')[1]).message;
      toast.error(errMessage);
    },
  });
};
