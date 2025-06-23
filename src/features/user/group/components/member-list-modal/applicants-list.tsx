'use client';

import { request } from '@/api/request';
import { Button } from '@/components/ui/button';
import { MemberInfo } from '@/features/user/group/components/member-list-modal/member-info';
import { useManageParticipation } from '@/features/user/group/hooks/useManageParticipation';
import { UserSummary } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { MemberListLoading } from '@/features/user/group/components/member-list-modal/member-list-loading';

type ApplicantsListProps = {
  groupId: string;
};

/**
 * 모임에 참여 신청한 사용자 목록 컴포넌트
 * 
 * 모임에 참여 신청한 사용자의 목록을 보여준다.
 * 
 * @param groupId 모임 id
 * @returns 모임에 참여 신청한 사용자 목록 컴포넌트
트 */
export const ApplicantsList = ({ groupId }: ApplicantsListProps) => {
  const { mutate: manageParticipation } = useManageParticipation();

  const {
    data: applicantsList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['group-member-list', groupId, 'applicants'],
    queryFn() {
      return request
        .get(`/v2/groups/${groupId}/waitinglist`)
        .then((res) => res.items);
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
    gcTime: 0,
  });

  return (
    <div className="flex-1">
      {isLoading && <MemberListLoading />}
      {isError && <>Error</>}
      {applicantsList && applicantsList.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full ">
          <p className="text-center font-medium text-gray-400">
            모임에 참여 신청한 사용자가 없어요.
          </p>
        </div>
      )}
      {applicantsList && applicantsList.length > 0 && (
        <ul className="flex flex-col gap-y-3">
          {applicantsList.map((applicant: UserSummary) => (
            <li
              key={applicant.userId}
              className="pb-5 border-b-2 border-gray-300 last:border-none border-dashed flex justify-between"
            >
              <MemberInfo
                userId={applicant.userId}
                nickname={applicant.nickname}
                email={applicant.email}
                profileImage={applicant.profileImage}
              />
              <div className="flex gap-x-2">
                <Button
                  variant="outline"
                  type="button"
                  className="h-9 w-12 border-gray-300! text-gray-500! text-sm font-medium"
                  onClick={() =>
                    manageParticipation({
                      groupId,
                      userId: String(applicant.userId),
                      status: 'deny',
                    })
                  }
                >
                  거절
                </Button>
                <Button
                  type="button"
                  className="h-9 w-12 text-sm font-medium"
                  onClick={() =>
                    manageParticipation({
                      groupId,
                      userId: String(applicant.userId),
                      status: 'approve',
                    })
                  }
                >
                  수락
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
