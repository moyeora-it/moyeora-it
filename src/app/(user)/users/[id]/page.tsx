import { Suspense } from 'react';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { QueryErrorBoundary } from '@/components/query-error-boundary';
import { GroupList } from '@/features/user/group/components/group-list';
import { request } from '@/api/request';
import { getAuthCookieHeader } from '@/utils/cookie';
import { GroupListLoading } from '@/features/user/group/components/group-list-loading';

type UserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params;

  const cookieHeaderValue = await getAuthCookieHeader();

  const queryClient = new QueryClient();

  const queryParams = {
    status: 'PARTICIPATING',
    size: 10,
    order: 'desc',
  };

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['items', `/v2/groups/usergroup/${id}`, queryParams],
    queryFn() {
      return request.get(
        `/v2/groups/usergroup/${id}`,
        {
          ...queryParams,
        },
        {
          credentials: 'include',
        },
        {
          Cookie: cookieHeaderValue,
        },
      );
    },
    initialPageParam: 0,
    retry: 0,
  });

  return (
    <>
      <QueryErrorBoundary>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <h1 className="text-2xl font-semibold mt-3">참여 중인 모임</h1>
          <Suspense fallback={<GroupListLoading />}>
            <GroupList status="PARTICIPATING" />
          </Suspense>
        </HydrationBoundary>
      </QueryErrorBoundary>
    </>
  );
}
