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

type EndedGroupsPageWrapperProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    search: string;
    type: string;
    order: string;
  }>;
};

type EndedGroupsPageProps = {
  params: { id: string };
  searchParams: {
    search: string;
    type: string;
  };
};

export default async function EndedGroupsPageWrapper({
  params,
  searchParams,
}: EndedGroupsPageWrapperProps) {
  const awaitedSearchParams = await searchParams;
  const awaitedParams = await params;
  return (
    <Suspense
      fallback={<GroupListLoading />}
      key={JSON.stringify(awaitedSearchParams)}
    >
      <EndedGroupsPage params={awaitedParams} searchParams={awaitedSearchParams} />
    </Suspense>
  );
}

const EndedGroupsPage = async ({
  params,
  searchParams,
}: EndedGroupsPageProps) => {
  const { id } = params;

  const { search, type } = searchParams;

  const queryClient = new QueryClient();

  const cookieHeaderValue = await getAuthCookieHeader();

  const queryParams = {
    type: type ?? 'study',
    ...(search && { search }),
    size: 50,
  };

  await queryClient.fetchInfiniteQuery({
    queryKey: ['items', `/v2/groups/usergroup/${id}`, queryParams],
    queryFn({ pageParam }) {
      return request.get(
        `/v2/groups/usergroup/${id}`,
        {
          ...queryParams,
          cursor: pageParam,
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
    <QueryErrorBoundary>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <GroupList status="ENDED" />
      </HydrationBoundary>
    </QueryErrorBoundary>
  );
};
