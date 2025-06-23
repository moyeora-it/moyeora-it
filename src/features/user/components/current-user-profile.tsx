'use client';

import { Avatar } from '@/components/atoms/avatar';
import useAuthStore from '@/stores/useAuthStore';
import { getSkill } from '@/types/enums';
import { EditUserProfileDialog } from '@/features/user/components/edit-user-profile-dialog';
import { AccountSettingsDialog } from '@/features/user/components/account-settings-dialog';
import { WithdrawDialog } from '@/features/user/components/withdraw-dialog';
import { getDisplayNickname, getDisplayProfileImage } from '@/utils/fallback';
import { Separator } from '@/components/ui/separator';

/**
 * 현재 로그인 한 유저의 프로필 컴포넌트
 *
 * 현재 로그인 한 유저의 프로필을 보여준다.
 *
 * @returns 현재 로그인 한 유저의 프로필 컴포넌트
 */

export const CurrentUserProfile = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <div>나의 정보를 불러오는 데 실패했어요. 다시 로그인 해주세요.</div>;
  }

  const { nickname, email, profileImage, skills } = user;

  return (
    <>
      <div className="flex absolute top-4 left-6 right-6 gap-x-3">
        <div className="flex flex-col items-center gap-y-4">
          <Avatar
            className="size-[4.75rem]"
            imageSrc={getDisplayProfileImage(profileImage)}
            fallback={getDisplayNickname(nickname, email)}
          />
          <EditUserProfileDialog />
        </div>
        <div className="flex flex-col gap-y-9 mt-4 flex-1 min-w-0">
          <div className="h-[28px] flex items-center">
            <span className="font-semibold">
              {getDisplayNickname(nickname, email)}
            </span>
          </div>
          <div className="flex flex-col gap-y-1 min-w-0">
            <div className="flex gap-x-2 min-w-0">
              <span className="text-sm font-medium shrink-0">기술스택</span>
              {skills && skills.length === 0 ? (
                <p className="text-gray-700 text-sm">
                  설정된 기술스택이 없어요.
                </p>
              ) : (
                <ul className="flex gap-x-3 overflow-x-auto flex-nowrap flex-1 min-w-0 scrollbar-hide">
                  {skills?.map((skill) => (
                    <li
                      className="text-sm font-normal text-gray-700 whitespace-nowrap shrink-0 relative after:content-[''] after:absolute after:right-[-0.375rem] after:top-1/2 after:-translate-y-1/2 after:w-[1px] after:h-3 after:bg-gray-300 last:after:hidden"
                      key={skill}
                    >
                      {getSkill(skill)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex gap-x-1.5">
              <span className="text-sm font-medium">이메일</span>
              <span className="text-sm font-normal text-gray-700 line-clamp-1">
                {email}
              </span>
            </div>
            <div className="flex gap-x-1.5 justify-end mr-3">
              <AccountSettingsDialog />
              <Separator orientation="vertical" />
              <WithdrawDialog />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
