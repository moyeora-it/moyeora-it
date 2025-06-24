'use client';

import { Avatar } from '@/components/atoms/avatar';
import { UserSummary } from '@/types';
import { getDisplayNickname, getDisplayProfileImage } from '@/utils/fallback';
import Link from 'next/link';

export const MemberInfo = ({
  userId,
  nickname,
  email,
  profileImage,
}: UserSummary) => (
  <div className="flex gap-x-6">
    <Link href={`/users/${userId}`}>
      <Avatar
        imageSrc={getDisplayProfileImage(profileImage)}
        fallback={getDisplayNickname(nickname, email)}
        className="size-14"
      />
    </Link>
    <div className="flex flex-col">
      <Link href={`/users/${userId}`} className="text-lg font-semibold">
        {getDisplayNickname(nickname, email)}
      </Link>
      <span className="text-sm text-gray-400">{email}</span>
    </div>
  </div>
);
