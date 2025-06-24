import { Avatar } from '@/components/atoms/avatar';
import { UserSummary } from '@/types';
import { getDisplayNickname, getDisplayProfileImage } from '@/utils/fallback';
import Link from 'next/link';

export const ParticipantCard = ({
  userId,
  nickname,
  profileImage,
  email,
}: UserSummary) => {
  return (
    <Link href={`/users/${userId}`} className="flex gap-3 boder-2 ">
      <Avatar
        imageSrc={getDisplayProfileImage(profileImage)}
        fallback={getDisplayNickname(nickname, email)}
      />
      <div>{getDisplayNickname(nickname, email)}</div>
    </Link>
  );
};
