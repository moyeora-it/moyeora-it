import { request } from '@/api/request';
import { Page } from '@/utils/flattenPages';
import {
  InfiniteData,
  useSuspenseInfiniteQuery,
  UseSuspenseInfiniteQueryOptions,
} from '@tanstack/react-query';

export const useFetchItems = <T>({
  url,
  queryParams = {},
  options = {},
  getNextPageParam,
}: {
  url: string;
  queryParams?: Record<string, string | number | null>;
  options?: Partial<
    UseSuspenseInfiniteQueryOptions<Page<T>, Error, InfiniteData<Page<T>>>
  >;
  getNextPageParam?: (lastPage: Page<T>) => number | null;
}) => {
  const isCursorNull = queryParams.order === 'desc';

  return useSuspenseInfiniteQuery<Page<T>, Error, InfiniteData<Page<T>>>({
    queryKey: ['items', url, queryParams ?? {}],
    queryFn: async ({ pageParam }): Promise<Page<T>> =>
      request.get(
        url,
        {
          ...queryParams,
          cursor:
            isCursorNull && pageParam === 0
              ? 'null'
              : (pageParam as number | string),
        },
        { credentials: 'include' },
      ),
    initialPageParam: 0,
    getNextPageParam(lastPage) {
      return getNextPageParam ? getNextPageParam(lastPage) : lastPage.hasNext ? lastPage.cursor : null;
    },
    ...options,
  });
};
