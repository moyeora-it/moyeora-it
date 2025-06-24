import AutoLoginClientManager from '@/features/auth/components/AutoLoginClientManager';
import { cookies } from 'next/headers';

// 사용자 접속시 http only 쿠키 여부를 판단합니다
// refresh 판단후 클라이언트 컴포넌트인 AutoLoginClient에서 자동로그인을 할지 결정합니다
export const AutoLoginManager = async () => {
  const cookieStore = await cookies();
  const hasRefreshToken = cookieStore.has('refreshToken');

  return <AutoLoginClientManager hasRefreshToken={hasRefreshToken} />;
};
