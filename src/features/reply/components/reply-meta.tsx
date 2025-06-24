'use client';

import { Avatar } from '@/components/atoms/avatar';
import { Reply } from '@/types';
import { formatDateTime } from '@/utils/dateUtils';
import { getDisplayNickname, getDisplayProfileImage } from '@/utils/fallback';

type ReplyMetaProps = Pick<Reply, 'writer' | 'createdAt'>;

export const ReplyMeta = ({ writer, createdAt }: ReplyMetaProps) => {
  return (
    <div className="flex gap-3 items-center">
      <Avatar
        imageSrc={getDisplayProfileImage(writer.profileImage)}
        fallback={getDisplayNickname(writer.nickname, writer.email)}
        className="w-10 h-10 cursor-pointer"
        onClick={() => {}}
      />
      <div className="flex flex-col">
        <div>{getDisplayNickname(writer.nickname, writer.email)}</div>
        <div className="text-gray-500 text-xs sm:text-sm">
          {formatDateTime(createdAt)}
        </div>
      </div>
    </div>
  );
};
