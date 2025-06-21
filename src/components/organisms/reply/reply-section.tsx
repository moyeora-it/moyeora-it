import { request } from '@/api/request';
import { ReplyForm } from '@/components/molecules/reply/reply-form';
import { QueryErrorBoundary } from '@/components/query-error-boundary';
import { getAuthCookieHeader } from '@/utils/cookie';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { ReplyList } from './reply-list';

export const ReplySection = async ({ groupId }: { groupId: number }) => {
  const queryClient = new QueryClient();
  const cookieHeaderValue = await getAuthCookieHeader();

  const queryParams = {
    size: 20,
  };

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['items', `/v2/groups/${groupId}/replies`, queryParams],
    queryFn: ({ pageParam }) =>
      request.get(
        `/v2/groups/${groupId}/replies`,
        {
          ...queryParams,
          cursor: pageParam,
        },
        {},
        {
          Cookie: cookieHeaderValue,
        },
      ),
    initialPageParam: 0,
    retry: 0,
  });

  const dehydratedState = dehydrate(queryClient);

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
        <HydrationBoundary state={dehydratedState}>
          <ReplyList />
        </HydrationBoundary>
      </QueryErrorBoundary>
    </>
  );
};
