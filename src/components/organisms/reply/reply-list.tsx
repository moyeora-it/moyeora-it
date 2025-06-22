'use client';

import { ReplyItem } from '@/components/organisms/reply/reply-item';
import { useFetchInView } from '@/hooks/useFetchInView';
import { useFetchItems } from '@/hooks/useFetchItems';
import { useReplyScrollIntoView } from '@/hooks/useReplyScrollIntoView';
import { useTargetReplyParams } from '@/hooks/useTargetReplyParams ';

import { useTargetReplyStore } from '@/stores/useTargetReply';
import { Reply } from '@/types';
import flattenPages from '@/utils/flattenPages';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const DATA_SIZE = 20;

export const ReplyList = () => {
  const { groupId } = useParams();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFetchItems<Reply>({
      url: `/v2/groups/${groupId}/replies`,
      queryParams: {
        size: DATA_SIZE,
      },
      options: {
        staleTime: 0,
      },
    });

  const { ref } = useFetchInView({
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
  });

  const { notificationTargetReplyId } = useTargetReplyParams();
  const setTargetReply = useTargetReplyStore((state) => state.setTargetReply);

  useEffect(() => {
    if (notificationTargetReplyId) {
      setTargetReply({
        targetReplyId: notificationTargetReplyId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationTargetReplyId]);

  const { itemRefs: replyRefs, bottomRef } = useReplyScrollIntoView({
    data,
    replyType: 'reply',
    hasNextPage,
  });

  const replies = flattenPages(data.pages);

  return (
    <section className="my-15">
      <ul className="flex flex-col gap-10">
        {replies.map((reply) => (
          <li
            key={reply.replyId}
            className="space-y-2"
            ref={(el) => {
              replyRefs.current[reply.replyId] = el;
            }}
          >
            <ReplyItem {...reply} />
          </li>
        ))}
      </ul>
      <div ref={bottomRef} id="reply-list-bottom" />
      {hasNextPage && !isFetchingNextPage && (
        <div ref={ref} className="h-2 -translate-y-100 bg-transparent" />
      )}
    </section>
  );
};
