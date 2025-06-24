import { useMutation } from '@tanstack/react-query';
import useAuthStore from '@/stores/useAuthStore';
import { Position, Skill } from '@/types/enums';
import { toast } from 'sonner';
import { User } from '@/types';
import { CommonResponse } from '@/types/response';
import { request } from '@/api/request';

/**
 * 프로필 수정 커스텀 훅
 *
 * @param userId 사용자 아이디
 * @returns 프로필 수정 커스텀 훅
 */
export const useUpdateProfileMutation = () => {
  const { setUser } = useAuthStore((state) => state);

  return useMutation({
    mutationFn: (data: {
      nickname: string;
      position: Position | null;
      skills: Skill[] | null;
      file?: File;
    }) => {
      const formData = new FormData();
      formData.append('nickname', data.nickname);

      if (data.position) {
        formData.append('position', JSON.stringify(data.position));
      }

      if (data.skills) {
        formData.append('skills', data.skills.join(','));
      }

      if (data.file) {
        formData.append('image', data.file);
      }

      return request.patch(`/v1/user/edit`, {}, formData, {
        credentials: 'include',
      });
    },
    onSuccess(response: CommonResponse<User>) {
      const user = response.data;
      // @ts-expect-error 백엔드에서 응답하는 객체에 userId 프로퍼티가 존재하지 않음. -> 추후 타입 수정 필요
      setUser({ ...user, userId: user.id });
      toast.success('프로필 수정 성공', {
        description: '프로필이 수정되었어요',
      });
    },
    onError() {
      toast.error('프로필 수정 실패', {
        description: '프로필 수정에 실패했어요. 잠시 후 다시 시도해주세요.',
      });
    },
  });
};
