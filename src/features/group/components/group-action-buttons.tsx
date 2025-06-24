'use client';

import { invalidateTag } from '@/actions/invalidate';
import { ShareButton } from '@/components/atoms/share-button';
import { ApplyJoinButton } from '@/features/group/components/apply-join-button';
import { CancelGroupButton } from '@/features/group/components/cancel-group-button';
import { CancelJoinButton } from '@/features/group/components/cancel-join-button';
import useAuthStore from '@/stores/useAuthStore';
import { useState } from 'react';

type GroupActionButtonsProps = {
  groupId: number;
  hostId: number;
  isApplicant: boolean;
  isJoined: boolean;
  autoAllow: boolean;
};

export const GroupActionButtons = ({
  groupId,
  hostId,
  isApplicant,
  isJoined,
  autoAllow,
}: GroupActionButtonsProps) => {
  const user = useAuthStore((state) => state.user);
  const [userType, setUserType] = useState<
    'none' | 'host' | 'applicant' | 'nonApplicant'
  >(() => {
    if (user === null) return 'none';
    if (user?.userId === hostId) return 'host';
    if (isApplicant) return 'applicant';
    return 'nonApplicant';
  });

  const successApply = () => {
    setUserType('applicant');

    // 자동 수락일 경우, 모임 상세 페이지 새로 불러오기
    if (autoAllow) {
      invalidateTag(`group-detail-${groupId}`);
    }
  };

  const successCancelApply = () => {
    setUserType('nonApplicant');

    // 수락된 참여자일 경우, 모임 상세 페이지 새로 불러오기
    if (isJoined) {
      invalidateTag(`group-detail-${groupId}`);
    }
  };

  if (userType === 'host') {
    return (
      <>
        <CancelGroupButton />
        <ShareButton />
      </>
    );
  }

  if (userType === 'applicant') {
    return <CancelJoinButton onSuccess={successCancelApply} />;
  }

  return <ApplyJoinButton onSuccess={successApply} />;
};
