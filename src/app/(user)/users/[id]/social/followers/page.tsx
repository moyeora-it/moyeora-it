import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { request } from '@/api/request';
import { Suspense } from 'react';
import { FollowersList } from '@/features/user/follow/components/followers-list';
import { QueryErrorBoundary } from '@/components/query-error-boundary';
import { getAuthCookieHeader } from '@/utils/cookie';
import FollowersPageLoading from '@/app/(user)/users/[id]/social/followers/loading';

type FollowersPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    search: string;
  }>;
};

export default async function FollowersPage({
  params,
  searchParams,
}: FollowersPageProps) {
  const queryParams = await searchParams;

  const cookieHeaderValue = await getAuthCookieHeader();

  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['items', `/v1/follow/${id}/followers`, queryParams],
    queryFn({ pageParam }) {
      return request.get(
        `/v1/follow/${id}/followers`,
        {
          ...(queryParams.search && { name: queryParams.search }),
          cursor: pageParam,
          size: 10,
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
          <Suspense fallback={<FollowersPageLoading />}>
            <FollowersList />
          </Suspense>
        </HydrationBoundary>
      </QueryErrorBoundary>
    </>
  );
}
