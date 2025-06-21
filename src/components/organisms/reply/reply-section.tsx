import { ReplyForm } from '@/components/molecules/reply/reply-form';
import { QueryErrorBoundary } from '@/components/query-error-boundary';
import { ReplyList } from './reply-list';

export const ReplySection = () => {
  return (
    <>
      <ReplyForm />
      <QueryErrorBoundary
        fallback={
          <p className="text-center text-gray-500 mt-30">
            댓글을 불러오는 중 문제가 발생했습니다.
          </p>
        }
      >
        <ReplyList />
      </QueryErrorBoundary>
    </>
  );
};
