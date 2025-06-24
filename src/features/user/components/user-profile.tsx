'use client';

import { useParams } from 'next/navigation';
import useAuthStore from '@/stores/useAuthStore';
import { CurrentUserProfile } from '@/features/user/components/current-user-profile';
import { OtherUserProfile } from '@/features/user/components/other-user-profile';

/**
 * 유저 프로필 컴포넌트
 *
 * 만약 현재 로그인한 사용자의 id와 id 세그먼트 값이 같다면, CurrentUserProfile 컴포넌트를 반환한다.
 * 그렇지 않으면, OtherUserProfile 컴포넌트를 반환한다.
 */
export const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);

  return (
    <div className='relative h-[168px] bg-white rounded-t-2xl'>
      <div className='rounded-t-2xl h-[73px] bg-green-300'/>
      {/* @ts-expect-error 백엔드에서 주는 사용자 아이디 프로퍼티가 userId가 아닌 id여서 일단 아래와 같이 변경 */}
      {String(user?.id) === id ? <CurrentUserProfile /> : <OtherUserProfile />}
    </div>
  );
};
