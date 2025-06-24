import { request } from '@/api/request';
import { User } from '@/types';
import { UserInfoResponse } from '@/types/response';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  fetchAndSetUser: () => Promise<void>;
};

/**
 * Zustand를 사용해 사용자 정보를 전역으로 관리하는 훅
 * - user: 현재 로그인한 사용자 정보, 초기값(로그인 안된 상태)은 null입니다
 * - setUser: 로그인한 유저 정보를 user param으로 받아 설정합니다
 * !!프로필 수정시 setUser 함수로 설정해주셔야 합니다!!
 * - clearUser: 현재 로그인 유저 정보를 null로 설정하여 지웁니다.
 */
const useAuthStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User) => set({ user }),
      clearUser: () => set({ user: null }),
      fetchAndSetUser: async () => {
        try {
          const responseBody: UserInfoResponse = await request.get(
            '/v1/user/info',
            {},
            {
              credentials: 'include',
            },
          );

          if (responseBody.status.success) {
            set({
              user: {
                //@ts-expect-error 백엔드에서 제공하는 타입이 이상해서 임시로 처리
                userId: responseBody.items.items.id,
                ...responseBody.items.items,
                profileImage: responseBody.items.items.profileImage ?? '/images/default-profile.png',
              },
            });
          } else {
            throw new Error('유저 정보 불러오기 실패');
          }
        } catch (error) {
          console.error('유저 정보 불러오기 실패', error);
          throw error; // 필요시 에러 처리 로직 추가
        }
      },
    }),
    {
      name: 'user-store',
    },
  ),
);

export default useAuthStore;
