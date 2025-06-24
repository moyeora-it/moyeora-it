'use client';

import { request } from '@/api/request';
import { BookmarkButton } from '@/features/bookmark/components/bookmark-button';
import useAuthStore from '@/stores/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { addBookmarkItem, getBookmarkList, removeBookmarkItem } from '../utils';

type BookmarkButtonContainerProps = {
  groupId: number;
  isBookmark: boolean;
};

/**
 * 북마크 버튼의 상태(isBookmark)를 내부에서 처리하는 컨테이너 컴포넌트
 *
 * - 로그인하지 않은 사용자의 경우, localStorage에서 북마크 여부를 확인합니다.
 */
export const BookmarkButtonContainer = ({
  groupId,
  isBookmark: initialIsBookmark,
}: BookmarkButtonContainerProps) => {
  const user = useAuthStore((state) => state.user);
  const [isBookmark, setIsBookmark] = useState(initialIsBookmark);

  const { mutate } = useMutation({
    mutationFn: (nextBookmarkStatus: boolean) =>
      request.patch(
        '/v2/bookmark',
        { 'Content-Type': 'application/json' },
        { groupId, isBookmark: nextBookmarkStatus },
        { credentials: 'include' },
      ),
    onError: () => {
      toast.error('찜하기에 실패했습니다.');
      setIsBookmark((prev) => !prev);
    },
  });

  useEffect(() => {
    if (!user) {
      const bookmarkList = getBookmarkList();
      setIsBookmark(bookmarkList.includes(groupId));
    }
  }, [groupId, user]);

  const toggleBookmark = async () => {
    const nextBookmarkState = !isBookmark;
    setIsBookmark(nextBookmarkState);

    if (!user) {
      if (nextBookmarkState) addBookmarkItem(groupId);
      else removeBookmarkItem(groupId);
    } else {
      mutate(nextBookmarkState);
    }
  };

  return (
    <BookmarkButton
      isBookmark={isBookmark}
      bookmarkToggleHandler={toggleBookmark}
    />
  );
};
