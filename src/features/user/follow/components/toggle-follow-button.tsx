'use client';

import { useRouter } from 'next/navigation';
import { useToggleFollow } from '@/features/user/follow/hooks/useToggleFollow';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import useAuthStore from '@/stores/useAuthStore';

type ToggleFollowButtonProps = {
  userId?: string;
  isFollowing: boolean;
  usedIn: string;
  className?: string;
};

export const ToggleFollowButton = ({
  userId,
  isFollowing,
  usedIn,
  className,
}: ToggleFollowButtonProps) => {
  const user = useAuthStore((state) => state.user);

  const router = useRouter();

  const { mutate: toggleFollow, isPending } = useToggleFollow({
    ...(userId && { userId }),
    isFollowing,
    usedIn,
  });

  const toggleFollowButtonClickHandler = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    toggleFollow();
  };

  return (
    <Button
      onClick={toggleFollowButtonClickHandler}
      disabled={isPending}
      className={className}
    >
      {isFollowing ? (
        <>
          <X className='size-4' />
          언팔하기
        </>
      ) : (
        <>
          <Plus className='size-4' />
          팔로우
        </>
      )}
    </Button>
  );
};
