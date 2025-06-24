import { useSearchParams } from 'next/navigation';

export const useTargetReplyParams = () => {
  const searchParams = useSearchParams();

  const replyIdParam = searchParams.get('replyId');
  const replyId =
    typeof replyIdParam === 'string' ? Number(replyIdParam) : null;

  const rereplyIdParam = searchParams.get('rereplyId');
  const rereplyId =
    typeof rereplyIdParam === 'string' ? Number(rereplyIdParam) : null;

  return {
    notificationTargetReplyId: replyId,
    notificationTargetRereplyId: rereplyId,
  };
};
