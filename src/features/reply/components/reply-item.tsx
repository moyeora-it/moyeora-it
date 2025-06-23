import { Reply } from '@/types';
import { ReplyContent } from './reply-content';
import { RereplySection } from './rereply-section';

export const ReplyItem = ({
  content,
  writer,
  createdAt,
  replyId,
  deleted,
}: Reply) => {
  return (
    <section className="border-2 rounded-lg">
      <ReplyContent
        content={content}
        writer={writer}
        createdAt={createdAt}
        replyId={replyId}
        deleted={deleted}
      />
      <RereplySection parentReplyId={replyId} />
    </section>
  );
};
