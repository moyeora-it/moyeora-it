'use client';

import { GroupCard } from '@/components/molecules/group/group-card';
import { Tab, TabType } from '@/components/molecules/tab';
import { Empty } from '@/components/organisms/empty';
import { useFetchInView } from '@/hooks/useFetchInView';
import { useFetchItems } from '@/hooks/useFetchItems';
import { Group, GroupType } from '@/types';
import flattenPages from '@/utils/flattenPages';
import Image from 'next/image';
import { useState } from 'react';

const CURSOR_SIZE = 100;

export const CardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex gap-4 items-center"
        >
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
            <div className="h-3 bg-gray-100 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

const tabList: TabType[] = [
  { value: '', label: '모든 그룹' },
  { value: GroupType.STUDY, label: '스터디' },
  { value: GroupType.PROJECT, label: '프로젝트' },
];
export function BookmarkPageClient() {
  // 쿼리 파라미터는 state로 관리
  const [queryParams, setQueryParams] = useState({
    size: CURSOR_SIZE,
    cursor: 0,
    sort: 'createdAt',
    order: 'asc',
  });

  //ISSUE: 일단 전체 그룹 데이터 가져오기
  const {
    data,
    isError,
    fetchNextPage,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchItems<Group>({
    url: '/v2/groups',
    queryParams,
    options: {
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: true,
    },
  });

  const { ref } = useFetchInView({
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    options: {
      rootMargin: '50px',
    },
  });

  const items = flattenPages(data.pages);
  const bookmarkItems = items.filter((item) => !item.isBookmark);

  // 탭 변경 핸들러
  const handleValueChange = (value: GroupType) => {
    setQueryParams((prev) => ({
      ...prev,
      type: `${value}`,
    }));
  };

  return (
    <div>
      <section className="flex flex-row gap-4 mb-8 w-full">
        <Image
          src="/logos/logo-img.svg"
          alt="모여라-IT"
          width={50}
          height={50}
        />
        <div className="flex flex-col gap-2 justify-center">
          <h2 className="text-xl font-bold">찜한 모임</h2>
          <p className="text-gray-600">마감되기 전에 지금 바로 참여해보세요!</p>
        </div>
      </section>
      <main>
        <Tab tabList={tabList} onValueChange={handleValueChange}>
          <div className="flex flex-col gap-4">
            {isError && (
              <Empty
                mainText="찜한 모임을 불러오는 중 문제가 발생했습니다."
                className="mt-[100px]"
              />
            )}
            {isLoading ? (
              <CardSkeleton />
            ) : bookmarkItems.length === 0 && !isError ? (
              <Empty
                mainText="아직 찜한 모임이 없어요."
                subText="관심있는 모임을 찜해보세요!"
                className="mt-[100px]"
              />
            ) : (
              <>
                <ul className="grid mt-8 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {items.map((group) => (
                    <li key={group.id}>
                      <GroupCard item={group} />
                    </li>
                  ))}
                </ul>
                {hasNextPage && !isFetchingNextPage && (
                  <div
                    ref={ref}
                    className="h-2 -translate-y-300 bg-transparent"
                  />
                )}
              </>
            )}
          </div>
        </Tab>
      </main>
    </div>
  );
}
