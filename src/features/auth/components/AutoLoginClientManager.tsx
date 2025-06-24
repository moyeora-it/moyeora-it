'use client';

import useAuthStore from '@/stores/useAuthStore';
import { useEffect } from 'react';

type AuthClientProviderProps = {
  hasRefreshToken: boolean;
};

// localStorage와 서버가 불일치 할 수도 있어서 재접속시 프로필 1회 업데이트
const AutoLoginClientManager = ({
  hasRefreshToken,
}: AuthClientProviderProps) => {
  const fetchAndSetUser = useAuthStore((s) => s.fetchAndSetUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  // 재접속시 무조건 한번만 실행되야함!! 0번도 안되고 2번도 안됨
  useEffect(() => {
    const getProfile = async () => {
      try {
        // 회원정보 불러오기 /me
        await fetchAndSetUser();
      } catch (e) {
        console.log(e);
        clearUser();
      }
    };

    if (hasRefreshToken) {
      getProfile();
    } else {
      clearUser();
    }

    // eslint-disable-next-line
  }, []);

  return null;
};

export default AutoLoginClientManager;
