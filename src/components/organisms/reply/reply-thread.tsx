'use client';

import { RereplyFormToggle } from '@/components/molecules/reply/rereply-form-toggle';
import { RereplyList } from '@/components/organisms/reply/rereply-list';
import { useTargetReplyParams } from '@/hooks/useTargetReplyParams ';
import { useTargetReplyStore } from '@/stores/useTargetReply';
import { useEffect, useState } from 'react';

export const ReplyThread = ({ parentReplyId }: { parentReplyId: number }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { notificationTargetReplyId, notificationTargetRereplyId } =
    useTargetReplyParams();
  const setTargetReply = useTargetReplyStore((state) => state.setTargetReply);

  useEffect(() => {
    if (
      notificationTargetRereplyId &&
      parentReplyId === notificationTargetReplyId
    ) {
      setIsOpen(true);
      setTargetReply({ targetRereplyId: notificationTargetRereplyId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationTargetReplyId, notificationTargetRereplyId, parentReplyId]);

  const toggleRereplyListHandler = () => {
    setTargetReply({ targetReplyId: null, targetRereplyId: null });
    setIsOpen(true);
  };

  return (
    <div>
      <div>
        <div className="flex justify-between mb-2 pt-3 px-5">
          <div className="font-semibold text-gray-500">대댓글</div>
          <button
            className="cursor-pointer text-gray-500 text-sm"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? '접기' : '보기'}
          </button>
        </div>
        {isOpen && <RereplyList parentReplyId={parentReplyId} />}
      </div>
      <RereplyFormToggle
        parentReplyId={parentReplyId}
        openRereplyList={toggleRereplyListHandler}
        isOpenRereplyList={isOpen}
      />
    </div>
  );
};
