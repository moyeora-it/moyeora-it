'use client';

import { GroupCard } from '@/components/molecules/group/group-card';
import { Empty } from '@/components/organisms/empty';
import { useFetchInView } from '@/hooks/useFetchInView';
import { useFetchItems } from '@/hooks/useFetchItems';
import { Group } from '@/types';
import { Position, Skill } from '@/types/enums';
import flattenPages from '@/utils/flattenPages';
import { useEffect, useMemo, useState } from 'react';

enum EMPTY_INFO_MESSAGE {
  EMPTY_INITIAL = '생성된 그룹이 없습니다',
  SEARCH = '검색 결과가 없습니다',
  FILTER = '조건에 해당하는 그룹이 없습니다.',
}

type GroupListProps = {
  serverQueryParams: Record<string, string | undefined>;
};

export const GroupList = ({ serverQueryParams }: GroupListProps) => {
  const [isEmptyItems, setIsEmptyItems] = useState(true);
  const [emptyInfoMessage, setEmptyInfoMessage] =
    useState<EMPTY_INFO_MESSAGE | null>(null);

  const queryParams = useMemo(() => {
    return {
      type: serverQueryParams.type ?? '',
      skill: serverQueryParams.skill
        ? serverQueryParams.skill
            .split(',')
            .map((v) => Skill[v as keyof typeof Skill])
            .join(',')
        : '',
      position: serverQueryParams.position
        ? serverQueryParams.position
            .split(',')
            .map((v) => Position[v as keyof typeof Position])
            .join(',')
        : '',
      sort: serverQueryParams.sort ?? 'createdAt',
      order: serverQueryParams.order ?? 'desc',
      search: serverQueryParams.search ?? '',
    };
  }, [
    serverQueryParams.type,
    serverQueryParams.skill,
    serverQueryParams.position,
    serverQueryParams.sort,
    serverQueryParams.order,
    serverQueryParams.search,
  ]);

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useFetchItems<Group>({
      url: '/v2/groups',
      queryParams: {
        ...queryParams,
        size: 10,
      },
    });

  const { ref } = useFetchInView({
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    options: {
      rootMargin: '300px',
    },
  });

  const items = flattenPages(data.pages);

  // 빈 data 처리 로직
  useEffect(() => {
    if (items.length === 0) {
      setIsEmptyItems(true);
      if (queryParams.search) {
        setEmptyInfoMessage(EMPTY_INFO_MESSAGE.SEARCH);
        return;
      } else if (
        queryParams.type ||
        queryParams.skill ||
        queryParams.position
      ) {
        setEmptyInfoMessage(EMPTY_INFO_MESSAGE.FILTER);
        return;
      } else {
        setEmptyInfoMessage(EMPTY_INFO_MESSAGE.EMPTY_INITIAL);
        return;
      }
    } else {
      setIsEmptyItems(false);
      setEmptyInfoMessage(null);
    }
  }, [queryParams, items.length]);

  return (
    <>
      {isEmptyItems && emptyInfoMessage !== null ? (
        <Empty mainText={emptyInfoMessage} subText="" />
      ) : (
        <ul className="grid mt-8 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map((group) => (
            <GroupCard key={group.id} item={group} />
          ))}
          {hasNextPage && <div className="h-[300px]" ref={ref}></div>}
        </ul>
      )}
    </>
  );
};
