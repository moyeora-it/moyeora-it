'use client';

import { GroupListItem } from '@/features/user/group/components/group-list-item';
import { useFetchInView } from '@/hooks/useFetchInView';
import { useFetchItems } from '@/hooks/useFetchItems';
import useAuthStore from '@/stores/useAuthStore';
import { Group } from '@/types';
import { isBeforeToday } from '@/utils/dateUtils';
import flattenPages from '@/utils/flattenPages';
import { useParams, useSearchParams } from 'next/navigation';

type GroupListProps = {
  status: 'PARTICIPATING' | 'RECRUITING' | 'ENDED';
};

/**
 * 모임 목록 컴포넌트
 *
 * 모임 목록을 보여준다.
 *
 * @returns 모임 목록 컴포넌트
 */
export const GroupList = ({ status }: GroupListProps) => {
  const user = useAuthStore((state) => state.user);

  const { id } = useParams();

  const isCurrentUser = String(user?.userId) === id;

  const searchParams = useSearchParams();

  const { search, type, order } = Object.fromEntries(searchParams.entries());

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFetchItems<Group>({
      url: `/v2/groups/usergroup/${id}`,
      queryParams: {
        type: type ?? 'study',
        status: 'PARTICIPATING',
        size: status !== 'ENDED' ? 10 : 50,
        ...(search && { search }),
        order: order === 'latest' || !order ? 'desc' : 'asc',
      },
      options: {
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        retry: 0,
      },
    });

  const { ref } = useFetchInView({
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
  });

  // @ts-expect-error 객체 안에 또 group 프로퍼티가 존재함.
  let groupList = flattenPages<Group>(data.pages).map((e) => e.group);
  if (status === 'ENDED') {
    groupList = groupList.filter((group) => isBeforeToday(group.endDate));
  }

  if (status === 'RECRUITING') {
    groupList = groupList.filter((group) => group.createUserId === Number(id));
  }

  return (
    <>
      {groupList.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-30">
          <p className="text-center font-medium text-gray-500">
            {status === 'RECRUITING' && '모집 중인 모임이 없어요.'}
            {status === 'PARTICIPATING' && '참여 중인 모임이 없어요.'}
            {status === 'ENDED' && '종료된 모임이 없어요.'}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 mt-7.5 gap-4 mb-3">
          {groupList.map((group) => (
            <GroupListItem
              key={group.id}
              group={group}
              isCurrentUser={isCurrentUser}
              status={status}
            />
          ))}
          {hasNextPage && <div ref={ref} className="h-10" />}
        </ul>
      )}
    </>
  );
};
