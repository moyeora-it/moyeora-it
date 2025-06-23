import { Reply } from '@/types';
import { forwardRef, useState } from 'react';
import { ReplyContent } from './reply-content';

/** 대댓글 삭제를 위해 ReplyContent를 둘러싸기 위해 만든 컴포넌트 */
export const RereplyItem = forwardRef<HTMLLIElement, Reply>((props, ref) => {
  const [isDeleted, setIsDeleted] = useState(props.deleted);

  if (isDeleted) return null;

  return (
    <li ref={ref} className="border-[1px] rounded-md mx-2 first:mt-6 last:mb-3">
      <ReplyContent {...props} onDelete={() => setIsDeleted(true)} />
    </li>
  );
});

RereplyItem.displayName = 'RereplyItem';
