import { request } from '@/api/request';
import { Groups } from '@/components/organisms/group';
import RecommendGroup from '@/components/organisms/recommend-group';
import { QueryErrorBoundary } from '@/components/query-error-boundary';
import { Position, Skill } from '@/types/enums';
import { getAuthCookieHeader } from '@/utils/cookie';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const awaitedSearchParams = await searchParams; // searchParams가 Promise 객체여서 await으로 벗겨내야 함
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 기본 캐싱 시간(1분)
      },
    },
  });

  const queryParams = {
    type: awaitedSearchParams.type ?? '',
    skill: awaitedSearchParams.skill
      ? awaitedSearchParams.skill.split(',')
        ? awaitedSearchParams.skill
            .split(',')
            .map((v) => Skill[v as keyof typeof Skill])
            .join(',')
        : Skill[awaitedSearchParams.skill as keyof typeof Skill]
      : '',
    position: awaitedSearchParams.position
      ? awaitedSearchParams.position.split(',')
        ? awaitedSearchParams.position
            .split(',')
            .map((v) => Position[v as keyof typeof Position])
            .join(',')
        : Position[awaitedSearchParams.position as keyof typeof Position]
      : '',
    sort: awaitedSearchParams.sort ?? 'createdAt',
    order: awaitedSearchParams.order ?? 'desc',
    search: awaitedSearchParams.search ?? '',
  };

  // console.log('✅ Fetching data from server ', queryParams); // DEV: 💡 서버 컴포넌트에서 prefetch 하는지 확인용
  const cookieHeaderValue = await getAuthCookieHeader();

  try {
    await queryClient.fetchInfiniteQuery({
      queryKey: ['items', '/v2/groups', { size: 10, ...queryParams }],
      queryFn({ pageParam }) {
        return request.get(
          '/v2/groups',
          {
            ...queryParams,
            size: 10,
            cursor:
              queryParams.order === 'desc' || !queryParams.order
                ? 'null'
                : pageParam,
          },
          { credentials: 'include' },
          { Cookie: cookieHeaderValue },
        );
      },
      initialPageParam: 0,
    });
  } catch (e) {
    //ISSUE: 에러 설정
    console.log(e);
    return <div>Error</div>;
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4">
      <div className="relative m-auto mb-10">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <div className="text-[20px] md:text-2xl font-extrabold">
            🔥 인기글
          </div>
          <RecommendGroup />
          {/* <div className="flex gap-2 absolute right-0">
          <SearchInput />
          <WriteGroupButton />
        </div> */}
          <QueryErrorBoundary
            fallback={
              <div className="text-center text-gray-500 mt-30">
                ⚠️ 그룹을 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.
              </div>
            }
          >
            <Groups serverQueryParams={awaitedSearchParams} />
          </QueryErrorBoundary>
        </HydrationBoundary>
      </div>
    </div>
  );
}
