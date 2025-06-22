'use client';

import { Avatar } from '@/components/atoms/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import FollowListItemsLoading from '@/features/user/follow/components/follow-list-items-loading';
import { RemoveFollowerButton } from '@/features/user/follow/components/remove-follower-button';
import { ToggleFollowButton } from '@/features/user/follow/components/toggle-follow-button';
import { useFetchInView } from '@/hooks/useFetchInView';
import { useFetchItems } from '@/hooks/useFetchItems';
import useAuthStore from '@/stores/useAuthStore';
import { User } from '@/types/index';
import { getDisplayNickname, getDisplayProfileImage } from '@/utils/fallback';
import flattenPages, { Page } from '@/utils/flattenPages';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

export const FollowersList = () => {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const isCurrentUser = id === String(user?.userId);

  const searchParams = useSearchParams();

  const search = searchParams.get('search');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFetchItems<User>({
      url: `/v1/follow/${id}/followers`,
      ...(search && { queryParams: { name: search } }),
      options: {
        refetchOnMount: true,
        staleTime: 0,
        retry: 0,
      },
    });

  const followersCount = (data.pages[0] as Page<User> & { totalCount: number })
    .totalCount;

  const { ref } = useFetchInView({
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
  });

  const followersList = flattenPages<User>(data.pages);

  return (
    <div className="flex flex-col gap-y-6 pb-4 rounded-b-2xl flex-1 mt-3">
      <div className="flex items-center">
        <div className="flex gap-x-1 items-center">
          <span className="text-sm font-semibold text-gray-500">
            총 팔로워 수 :{' '}
          </span>
          <span className="text-sm font-semibold text-gray-500">
            {followersCount ?? 0}
          </span>
        </div>
      </div>
      {followersList.length === 0 ? (
        <div className="flex flex-1 justify-center items-center">
          <p className="text-center font-medium text-gray-400">
            아직 팔로워가 없어요.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <h1 className="hidden">팔로워 {followersCount ?? null}</h1>
          {followersList.map(
            // @ts-expect-error 현재 User 타입에는 id 프로퍼티가 없음 -> 추후 수정 필요
            ({ id: userId, nickname, profileImage, email, isFollowing }) => (
              <li
                className="border-b-2 border-gray-200 border-dashed pb-6 "
                key={userId}
              >
                <Link href={`/users/${userId}`}>
                  <div className="flex justify-between">
                    <div className="flex gap-x-6">
                      <Avatar
                        imageSrc={getDisplayProfileImage(profileImage)}
                        fallback={getDisplayNickname(nickname, email)}
                        className="size-[4.75rem]"
                      />
                      <div className="flex flex-col justify-start">
                        <span className="text-gray-900 text-lg font-semibold">
                          {getDisplayNickname(nickname, email)}
                        </span>
                        <span className="text-gray-300 text-sm font-medium">
                          {email}
                        </span>
                      </div>
                    </div>
                    {user && String(user?.userId) !== String(userId) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="size-6 self-start inline-flex justify-center"
                          >
                            <Image
                              src="/icons/more.svg"
                              alt="more"
                              width={3.5}
                              height={3.5}
                            />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-[110px]">
                          {isCurrentUser && (
                            <RemoveFollowerButton userId={String(userId)} />
                          )}

                          {!isCurrentUser && (
                            <ToggleFollowButton
                              userId={String(userId)}
                              isFollowing={isFollowing}
                              usedIn="followers"
                              className={`shadow-none hover:bg-white! ${
                                isFollowing
                                  ? 'text-red-600 [&>svg]:text-red-600!'
                                  : 'text-black [&_svg]:text-black'
                              } bg-white h-[28px] cursor-pointer text-sm font-semibold rounded-lg py-1 px-3 gap-x-[6px]`}
                            />
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </Link>
              </li>
            ),
          )}
          {isFetchingNextPage && <FollowListItemsLoading itemCount={4} />}
          {!isFetchingNextPage && hasNextPage && (
            <div ref={ref} className="h-10" />
          )}
        </ul>
      )}
    </div>
  );
};
