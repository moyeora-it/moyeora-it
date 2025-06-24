'use client';

import { request } from '@/api/request';
import { MemberInfo } from '@/features/user/group/components/member-list-modal/member-info';
import { UserSummary } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { MemberListLoading } from '@/features/user/group/components/member-list-modal/member-list-loading';

type ParticipantsListProps = {
  groupId: string;
};

/**
 * 모임에 참여한 사용자 목록 컴포넌트
 *
 * 모임에 참여한 사용자의 목록을 보여준다.
 *
 * @param groupId 모임 id
 * @returns 모임에 참여한 사용자 목록 컴포넌트
 */
export const ParticipantsList = ({ groupId }: ParticipantsListProps) => {
  const {
    data: participantsList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['group-member-list', groupId, 'participants'],
    queryFn() {
      return request
        .get(`/v2/groups/${groupId}/participants`)
        .then((res) => res.items.participants);
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
    gcTime: 0,
  });

  return (
    <div>
      {isLoading && <MemberListLoading />}
      {isError && <>Error</>}
      {participantsList && (
        <ul className="flex flex-col gap-y-3">
          {participantsList.map((participant: UserSummary) => (
            <li
              key={participant.userId}
              className="pb-5 border-b-2 border-gray-300 last:border-none border-dashed"
            >
              <MemberInfo
                userId={participant.userId}
                nickname={participant.nickname}
                email={participant.email}
                profileImage={participant.profileImage}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
