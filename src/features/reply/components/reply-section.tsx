import { QueryErrorBoundary } from '@/components/query-error-boundary';
import { ReplyForm } from './reply-form';
import { ReplyList } from './reply-list';

export const ReplySection = () => {
  return (
    <div className="flex flex-col gap-10">
      <h2 className="text-2xl font-bold pb-6 border-b-2 border-gray-100">
        댓글
      </h2>
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
    </div>
  );
};
