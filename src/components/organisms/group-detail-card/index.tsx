import { Avatar } from '@/components/atoms/avatar';
import { Badge } from '@/components/atoms/badge';
import { GroupProgress } from '@/components/atoms/group/particiapant-progress';
import { PositionBadge } from '@/components/molecules/position-badge';
import { SkillBadge } from '@/components/molecules/skill-badge';
import { ParticipantListModal } from '@/components/organisms/participant-list-modal';
import { BookmarkButtonContainer } from '@/features/bookmark/components/bookmark-button-container';
import { GroupDetail, GroupTypeName } from '@/types';
import { Position, Skill } from '@/types/enums';
import { formatYearMonthDayWithDot } from '@/utils/dateUtils';
import { getDisplayNickname, getDisplayProfileImage } from '@/utils/fallback';
import Link from 'next/link';

type GroupDetailCardProps = {
  info: GroupDetail;
  isRecruiting: boolean;
};

export const GroupDetailCard = ({
  info,
  isRecruiting,
}: GroupDetailCardProps) => {
  return (
    <article className="flex flex-col gap-5 w-full items-center">
      <header className="flex flex-col gap-8 w-full max-w-[900px] px-3">
        <div className="flex justify-between items-start">
          <h1 className="font-bold text-3xl flex flex-col gap-2">
            <Badge
              text={isRecruiting ? '모집 중' : '모집 마감'}
              className="w-[fit-content] text-sm font-semibold bg-primary"
            />
            {info.group.title}
          </h1>
          <BookmarkButtonContainer
            groupId={info.group.id}
            isBookmark={info.group.isBookmark}
          />
        </div>
        <div className="flex gap-2 items-center">
          <Link href={`/users/${info.host.userId}`} className="flex gap-2">
            <Avatar
              imageSrc={getDisplayProfileImage(info.host.profileImage)}
              fallback={getDisplayNickname(info.host.nickname, info.host.email)}
            />
            <span className="font-semibold">
              {getDisplayNickname(info.host.nickname, info.host.email)}
            </span>
          </Link>
        </div>
      </header>

      <section className="border border-gray-200 rounded-2xl bg-white flex flex-col gap-5 py-8 px-6 w-full max-w-[900px]">
        <GroupInfoItem label="모집 구분">
          <Badge
            text={GroupTypeName[info.group.type]}
            className="w-[fit-content] text-sm font-semibold bg-gray-200"
          />
        </GroupInfoItem>

        <GroupInfoItem label="모집 마감">
          {formatYearMonthDayWithDot(new Date(info.group.deadline))}
        </GroupInfoItem>

        <GroupInfoItem label="예상 일정">
          {formatYearMonthDayWithDot(new Date(info.group.startDate))} ~{' '}
          {formatYearMonthDayWithDot(new Date(info.group.endDate))}
        </GroupInfoItem>

        <GroupInfoItem label="모집 분야">
          <ul className="flex gap-2 w-full flex-wrap">
            {info.group.position.map((position, i) => (
              <li key={i}>
                <PositionBadge name={Position[position]} />
              </li>
            ))}
          </ul>
        </GroupInfoItem>

        <GroupInfoItem label="기술 스택">
          <ul className="flex gap-2 w-full flex-wrap">
            {info.group.skills?.map((skill, i) => (
              <li key={i}>
                <SkillBadge name={Skill[skill]} />
              </li>
            ))}
          </ul>
        </GroupInfoItem>

        <div className="font-bold">
          <div className="whitespace-nowrap text-gray-600">
            모집 현황 ({isRecruiting ? '모집 중' : '모집 마감'})
          </div>
          <div className="-mt-3">
            <GroupProgress
              participantsCount={info.group.participants.length}
              maxParticipants={info.group.maxParticipants}
            />
          </div>
        </div>

        <GroupInfoItem label="참여자">
          <div className="flex justify-between">
            <div className="flex">
              {info.group.participants
                .slice(0, 3)
                .map(({ userId, profileImage, email, nickname }, index) => (
                  <Avatar
                    key={userId}
                    imageSrc={getDisplayProfileImage(profileImage)}
                    fallback={getDisplayNickname(nickname, email)}
                    className={`${index !== 0 ? '-ml-3' : ''} ${getZIndexClass(
                      index,
                    )}`}
                  />
                ))}
              <ParticipantListModal
                participants={info.group.participants}
                className={`z-50 ${
                  info.group.participants.length > 0 ? '-ml-3' : ''
                }`}
              />
            </div>
          </div>
        </GroupInfoItem>
      </section>
    </article>
  );
};

const getZIndexClass = (index: number) => {
  const zIndexMap = ['z-10', 'z-20', 'z-30'];
  return zIndexMap[index] ?? 'z-0';
};

const GroupInfoItem = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex gap-4 font-bold items-center">
      <div className="whitespace-nowrap text-gray-600">{label}</div>
      <div>{children}</div>
    </div>
  );
};
