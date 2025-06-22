'use client';

import { Badge } from '@/components/atoms/badge';
import { CloseCover } from '@/components/atoms/group/close-cover';
import { Deadline } from '@/components/atoms/group/deadline';
import { GroupPositions } from '@/components/atoms/group/group-positions';
import { GroupTitle } from '@/components/atoms/group/group-title';
import { GroupProgress } from '@/components/atoms/group/particiapant-progress';
import { BookmarkButtonContainer } from '@/features/bookmark/components/bookmark-button-container';
import { Group, GroupTypeName } from '@/types';
import { formatYearMonthDayWithDot, isBeforeToday } from '@/utils/dateUtils';
import { routes } from '@/utils/routes';
import Link from 'next/link';
import { GroupSkills } from '../../atoms/group/group-skills';

type GroupCardProps = {
  item: Group;
};

// TODO : 섹션별로 component 나누기
export const GroupCard = ({ item }: GroupCardProps) => {
  const isClosed = isBeforeToday(item.deadline);

  return (
    <div className="relative p-5 h-[280px] lg:h-[316px] bg-white shadow-sm ring-2 ring-gray-300/30 rounded-xl">
      <div className="absolute top-0 right-0 m-6">
        <BookmarkButtonContainer
          isBookmark={item.isBookmark}
          groupId={item.id}
        />
      </div>
      <Link
        href={routes.groupDetail(item.id)}
        className="flex flex-col justify-between h-full"
      >
        <div>
          <Badge
            text={GroupTypeName[item.type]}
            className="w-[fit-content] text-sm font-semibold bg-gray-200"
          />
          <Deadline text={formatYearMonthDayWithDot(item.deadline)} />
          <GroupTitle text={item.title} />
        </div>
        <GroupProgress
          participantsCount={item.participants.length}
          maxParticipants={item.maxParticipants}
        />
        <div className="mt-4">
          <div className="flex flex-col gap-2">
            <GroupSkills skills={item.skills} />
            <GroupPositions positions={item.position} />
          </div>
        </div>
      </Link>
      {isClosed && <CloseCover itemId={item.id} />}
    </div>
  );
};
