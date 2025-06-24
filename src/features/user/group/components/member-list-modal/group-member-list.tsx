'use client';

import { ApplicantsList } from '@/features/user/group/components/member-list-modal/applicants-list';
import { ParticipantsList } from '@/features/user/group/components/member-list-modal/participants-list';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type GroupMemberListProps = {
  groupId: string;
};

/**
 * 모임 참여/신청자 목록 컴포넌트
 *
 * 탭에 따라 모임 참여/신청자 목록을 보여준다.
 *
 * @param groupId 모임 id
 * @returns 모임 참여/신청자 목록 컴포넌트
 */
export const GroupMemberList = ({ groupId }: GroupMemberListProps) => {
  const { id } = useParams();

  const queryClient = useQueryClient();

  const [currentTab, setCurrentTab] = useState<'participants' | 'applicants'>(
    'applicants',
  );

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({
        queryKey: ['items', `/v2/groups/usergroup/${id}`],
      });
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col gap-y-4 flex-1">
      <ul className="flex items-center gap-x-4">
        {['applicants', 'participants'].map((tab) => (
          <li key={tab} className="relative">
            <button
              type="button"
              className={`font-medium ${
                tab === currentTab
                  ? 'after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-gray-900'
                  : 'text-gray-400'
              }`}
              onClick={() =>
                setCurrentTab(tab as 'participants' | 'applicants')
              }
            >
              {tab === 'participants' ? '확정멤버' : '수락 대기중'}
            </button>
          </li>
        ))}
      </ul>
      {currentTab === 'applicants' && <ApplicantsList groupId={groupId} />}
      {currentTab === 'participants' && <ParticipantsList groupId={groupId} />}
    </div>
  );
};
