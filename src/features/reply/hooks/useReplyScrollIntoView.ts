import { useTargetReplyStore } from '@/stores/useTargetReply';
import { Reply } from '@/types';
import { Page } from '@/utils/flattenPages';
import type { InfiniteData } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface UseReplyScrollIntoViewProps {
  data: InfiniteData<Page<Reply>>;
  replyType: 'reply' | 'rereply';
  hasNextPage: boolean;
}

/**
 * useTargetReplyStore에 저장된 목표 댓글로 스크롤 이동시키기 위한 커스텀 훅
 *
 * @param data - useInfiniteQuery로 가져온 페이지네이션된 댓글 데이터
 * @param replyType - 목표물이 댓글인지 대댓글인지 타입
 * @param hasNextPage - 추가 데이터를 불러올 수 있는지 여부
 *
 * @returns itemRefs - 댓글 각각에 대응되는 ref 객체
 * @returns bottomRef - 요소가 존재하지 않을 경우 스크롤할 fallback 위치
 */
export const useReplyScrollIntoView = ({
  data,
  replyType,
  hasNextPage,
}: UseReplyScrollIntoViewProps) => {
  const itemRefs = useRef<Record<number, HTMLLIElement | null>>({});
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { targetReplyId, targetRereplyId, setTargetReply } =
    useTargetReplyStore();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasSetToastRef = useRef<boolean>(false);

  const getTargetId = (): number | undefined => {
    if (replyType === 'reply') return targetReplyId ?? undefined;
    if (replyType === 'rereply') return targetRereplyId ?? undefined;
  };

  const clearTargetQueryAndState = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (replyType === 'reply') {
      params.delete('replyId');
      setTargetReply({ targetReplyId: null });
    } else {
      params.delete('replyId');
      params.delete('rereplyId');
      setTargetReply({ targetRereplyId: null });
    }

    const query = params.toString();
    const newUrl = query ? `${pathname}?${query}` : pathname;
    window.history.replaceState(null, '', newUrl);
  };

  const scrollToElement = (element: HTMLElement | null) => {
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const showReplyNotFoundToast = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.has('replyId')) {
      toast.error('존재하지 않는 댓글입니다.');
    } else if (params.has('rereplyId')) {
      toast.error('삭제된 대댓글입니다.');
    }

    clearTargetQueryAndState();
    setTargetReply({ targetReplyId: null, targetRereplyId: null });
  };

  useEffect(() => {
    const targetId = getTargetId();
    if (!targetId) return;

    const targetElement = itemRefs.current[targetId];

    if (targetElement) {
      scrollToElement(targetElement);
      clearTargetQueryAndState();
    } else {
      scrollToElement(bottomRef.current);

      if (!hasNextPage && !hasSetToastRef.current) {
        hasSetToastRef.current = true;
        setTimeout(showReplyNotFoundToast, 1000);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetReplyId, targetRereplyId, data]);

  return {
    itemRefs,
    bottomRef,
  };
};
