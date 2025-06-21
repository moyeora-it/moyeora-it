import { useTargetReplyStore } from '@/stores/useTargetReply';
import { Reply } from '@/types';
import { Page } from '@/utils/flattenPages';
import type { InfiniteData } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface UseReplyScrollIntoViewProps {
  data: InfiniteData<Page<Reply>>;
  replyType: 'reply' | 'rereply';
}

/**
 * useTargetReplyStore에 저장된 목표 댓글로 스크롤 이동시키기 위한 커스텀 훅
 *
 * @param data - useInfiniteQuery로 가져온 페이지네이션된 댓글 데이터
 * @param replyType - 목표물이 댓글인지 대댓글인지 타입
 *
 * @returns itemRefs - 댓글 각각에 대응되는 ref 객체
 * @returns bottomRef - 요소가 존재하지 않을 경우 스크롤할 fallback 위치
 */
export const useReplyScrollIntoView = ({
  data,
  replyType,
}: UseReplyScrollIntoViewProps) => {
  const itemRefs = useRef<Record<number, HTMLLIElement | null>>({});
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { targetReplyId, targetRereplyId, setTargetReply } =
    useTargetReplyStore();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let target: number | undefined;

    if (replyType === 'reply') {
      if (!targetReplyId) return;
      target = targetReplyId;
    }

    if (replyType === 'rereply') {
      if (!targetRereplyId) return;
      target = targetRereplyId;
    }

    if (!target) return;

    const targetElement = itemRefs.current[target];

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

      if (replyType === 'reply') {
        setTargetReply({ targetReplyId: null });
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete('replyId');
        const newQuery = newParams.toString();
        const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
        router.replace(newUrl, { scroll: false });
      } else {
        setTargetReply({ targetRereplyId: null });
        router.replace(pathname, { scroll: false });
      }
    } else {
      bottomRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetReplyId, targetRereplyId, data]);

  return {
    itemRefs,
    bottomRef,
  };
};
