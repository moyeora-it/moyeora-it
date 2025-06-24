import { useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/api/request';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';

/**
 * 팔로우, 언팔로우 기능을 위한 커스텀 훅
 *
 * usedIn prop를 추가한 이유는 이 커스텀 훅을 호출한 버튼이 사용된 위치에 따라 무효화할 쿼리 키를 다르게 설정하기 위함
 *
 * @param userId: 팔로우, 언팔로우 대상 유저 ID
 * @param isFollowing: 팔로우 상태
 * @param usedIn: 해당 커스텀 훅을 호출한 버튼이 사용된 위치 (프로필, 팔로잉 목록, 팔로워 목록)
 * @returns useMutation 반환값
 */
export const useToggleFollow = ({
  userId,
  isFollowing,
  usedIn,
}: {
  userId?: string;
  isFollowing: boolean;
  usedIn: string;
}) => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn() {
      if (isFollowing) {
        return request.delete(`/v1/follow/${userId ?? id}/unfollow`, {
          credentials: 'include',
        });
      }
      return request.post(
        `/v1/follow/${userId ?? id}`,
        {
          'Content-Type': 'application/json',
        },
        JSON.stringify({ id: userId ?? id }),
        { credentials: 'include' },
      );
    },
    onError() {
      toast.error('에러가 발생했어요.', {
        description:
          '요청 사항을 처리하는 데 에러가 발생했어요. 잠시 후 다시 시도해주세요.',
      });
    },
    onSettled() {
      if (usedIn === 'profile')
        return Promise.all([
          queryClient.invalidateQueries({
            queryKey: ['user', id],
            exact: true,
          }),
          queryClient.invalidateQueries({
            queryKey: ['items', `/v1/follow/${id}/followers`],
          }),
        ]);
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['user', id, `${usedIn} count`],
        }),
        queryClient.invalidateQueries({
          queryKey: ['items', `/v1/follow/${id}/${usedIn}`],
        }),
      ]);
    },
  });
};
