import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { request } from '@/api/request';
import { Suspense } from 'react';
import { FollowingList } from '@/features/user/follow/components/following-list';
import { QueryErrorBoundary } from '@/components/query-error-boundary';
import { getAuthCookieHeader } from '@/utils/cookie';
import FollowingsPageLoading from '@/app/(user)/users/[id]/social/followings/loading';

type FollowingsPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    search: string;
  }>;
};

export default async function FollowingsPage({
  params,
  searchParams,
}: FollowingsPageProps) {
  const queryParams = await searchParams;

  const cookieHeaderValue = await getAuthCookieHeader();

  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['items', `/v1/follow/${id}/following`, queryParams],
    queryFn({ pageParam }) {
      return request.get(`/v1/follow/${id}/following`, {
        ...(queryParams.search && { name: queryParams.search }),
        cursor: pageParam,
        size: 10,
      }, {
        credentials: 'include',
      }, {
        Cookie: cookieHeaderValue,
      });
    },
    initialPageParam: 0,
    retry: 0,
  });

  return (
    <>
      <QueryErrorBoundary>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<FollowingsPageLoading />}>
            <FollowingList />
          </Suspense>
        </HydrationBoundary>
      </QueryErrorBoundary>
    </>
  );
}
