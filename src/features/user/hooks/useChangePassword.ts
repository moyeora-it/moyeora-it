import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { request } from '@/api/request';

/**
 * 비밀번호 변경 커스텀 훅
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({
      newPassword,
      currentPassword,
    }: {
      newPassword: string;
      currentPassword: string;
    }) => {
      return request.patch(
        '/v1/user/password-change',
        {
          'Content-Type': 'application/json',
        },
        {
          newPassword,
          confirmPassword: currentPassword,
        },
        {
          credentials: 'include',
        },
      );
    },
    onSuccess() {
      toast.success('비밀번호 변경 성공', {
        description: '비밀번호가 변경되었어요',
      });
    },
    onError(error) {
      const errInfo = JSON.parse(error.message.split('-')[1]);
      toast.error('비밀번호 변경 실패', {
        description: errInfo.status.message,
      });
    },
  });
};
