import { request } from '@/api/request';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

export const CancelJoinButton = ({ onSuccess }: { onSuccess: () => void }) => {
  const { groupId } = useParams<{ groupId: string }>();
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      request.delete(`/v2/groups/${groupId}/applications`, {
        credentials: 'include',
      }),
    onError: () => {
      toast.error(
        '참여 신청 취소에 실패하였습니다. 잠시 후 다시 시도해주세요.',
      );
    },
    onSuccess: () => {
      onSuccess();
      toast.success('참여 신청이 취소되었습니다.');
    },
  });

  const cancelJoinHandler = () => {
    mutate();
  };

  return (
    <Button
      onClick={cancelJoinHandler}
      disabled={isPending}
      className="cursor-pointer"
    >
      참여 신청 취소
    </Button>
  );
};
