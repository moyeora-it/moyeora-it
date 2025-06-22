'use client';

import { request } from '@/api/request';
import { LoginRequireButton } from '@/components/atoms/login-require-button';
import { useTargetReplyStore } from '@/stores/useTargetReply';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type ReplyFormProps = {
  onSuccess?: () => void;
  parentReplyId?: number;
  isOpenRereplyList?: boolean;
};

export const ReplyForm = ({
  onSuccess,
  parentReplyId,
  isOpenRereplyList,
}: ReplyFormProps) => {
  const { groupId } = useParams();
  const [replyContent, setReplyContent] = useState<string>('');
  const setTargetReply = useTargetReplyStore((state) => state.setTargetReply);

  const endpoint =
    parentReplyId === undefined
      ? `/v2/groups/${groupId}/replies`
      : `/v2/groups/${groupId}/replies/${parentReplyId}`;

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (content: string) =>
      request.post(
        endpoint,
        { 'Content-Type': 'application/json' },
        JSON.stringify({ content }),
        { credentials: 'include' },
      ),
    onSuccess: (data) => {
      // 목록 무효화 후, 작성한 댓글로 이동
      queryClient.invalidateQueries({
        queryKey: ['items', endpoint],
      });

      onSuccess?.();
      setReplyContent('');

      if (parentReplyId === undefined) {
        setTargetReply({ targetReplyId: data.items, targetRereplyId: null });
      } else if (!isOpenRereplyList) {
        setTargetReply({
          targetReplyId: parentReplyId,
          targetRereplyId: data.items,
        });
      }
    },
    onError: () => {
      toast.error('댓글 등록에 실패하였습니다.');
    },
  });

  const submitReplyButtonClickHandler = async () => {
    if (!replyContent.trim()) return;
    mutate(replyContent);
  };

  return (
    <div className="space-y-2">
      <textarea
        placeholder="댓글을 입력하세요."
        className="w-full p-2 border rounded-lg h-20 resize-none"
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
      />
      <div className="flex justify-end">
        <LoginRequireButton onClick={submitReplyButtonClickHandler}>
          등록
        </LoginRequireButton>
      </div>
    </div>
  );
};
