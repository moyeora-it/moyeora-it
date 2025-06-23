'use client';

import Link from 'next/link';
import { Group } from '@/types';
import { formatYearMonthDayWithDot, isBeforeToday } from '@/utils/dateUtils';
import { MemberListDialog } from '@/features/user/group/components/member-list-modal/member-list-dialog';
import { CalendarDays, UsersRound } from 'lucide-react';
import { Avatar } from '@/components/atoms/avatar';
import { getDisplayProfileImage, getDisplayNickname } from '@/utils/fallback';
import { GroupSkills } from '@/components/atoms/group/group-skills';
import { GroupPositions } from '@/components/atoms/group/group-positions';

type GroupListItemProps = {
  group: Group;
  isCurrentUser: boolean;
  status: 'PARTICIPATING' | 'RECRUITING' | 'ENDED';
};

const getIsRecruiting = (group: Group) => {
  if (!isBeforeToday(group.deadline)) {
    return group.participants.length < group.maxParticipants;
  }
  return false;
};

export const GroupListItem = ({
  group,
  isCurrentUser,
  status,
}: GroupListItemProps) => {
  const { id, startDate, endDate, title, participants, maxParticipants, type } =
    group;

  return (
    <li className="border border-gray-200 rounded-2xl h-60 p-4 hover:bg-gray-50 transition-colors relative">
      <Link href={`/groups/${id}`}>
        <div className="flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold truncate">{title}</h3>
            {status === 'RECRUITING' ? (
              <span
                className={`text-sm inline-block font-medium px-3 py-1 rounded-lg shrink-0 ${
                  getIsRecruiting(group)
                    ? 'bg-gray-50 text-gray-600'
                    : 'bg-green-50 text-green-500'
                }`}
              >
                {getIsRecruiting(group) ? '모집중' : '모집완료'}
              </span>
            ) : (
              <span
                className={`text-sm inline-block font-medium px-3 py-1 rounded-lg bg-green-50 text-green-500 shrink-0`}
              >
                {type === 'study' ? '스터디' : '프로젝트'}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-y-2.5">
            <div className="flex items-center gap-x-1.5">
              <div className="flex items-center gap-x-0.5">
                <CalendarDays className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600 font-medium">
                  진행 기간
                </span>
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {formatYearMonthDayWithDot(startDate)} ~{' '}
                {formatYearMonthDayWithDot(endDate)}
              </span>
            </div>
            <GroupSkills skills={group.skills} />
            <GroupPositions positions={group.position} />
            <div className="flex items-center gap-x-3 border-t border-gray-200 pt-3">
              <div className="flex items-center gap-x-1.5">
                <UsersRound className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600 font-medium">
                  {participants.length} / {maxParticipants}명
                </span>
              </div>
              <div className="items-center hidden md:flex">
                {participants.map((participant, i) => {
                  if (i > 3) {
                    return (
                      <div key={'indicator'} className="size-8 bg-gray-100 border border-gray-200 text-gray-600 rounded-full flex items-center justify-center z-10 -ml-3">
                        <span className="text-xs font-medium">
                          +{participants.length - 4}
                        </span>
                      </div>
                    );
                  }
                  return (
                    <Avatar
                      key={participant.userId}
                      imageSrc={getDisplayProfileImage(
                        participant.profileImage,
                      )}
                      fallback={getDisplayNickname(
                        participant.nickname,
                        participant.email,
                      )}
                      className={`border border-gray-200 size-8 ${i >= 1 ? '-ml-3' : 'ml-0'} z-10`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Link>
      {isCurrentUser && status === 'RECRUITING' && (
        <MemberListDialog groupId={String(id)} groupTitle={title} />
      )}
      {
        isCurrentUser && status === 'ENDED' && false
        // TODO: 별점을 달 수 있는 모달 같은 것을 추가
      }
    </li>
  );
};
