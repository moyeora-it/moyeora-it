'use client';

import Image from 'next/image';

type Props = {
  isBookmark: boolean;
  bookmarkToggleHandler: () => void;
};

export const BookmarkButton = ({
  isBookmark,
  bookmarkToggleHandler,
}: Props) => {
  return (
    <button onClick={bookmarkToggleHandler} className="cursor-pointer">
      <Image
        src={`/icons/bookmark-${isBookmark ? 'active' : 'default'}.svg`}
        alt="찜하기"
        width={24}
        height={24}
      />
    </button>
  );
};
