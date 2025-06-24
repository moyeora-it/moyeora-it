import { cookies } from 'next/headers';
import { UserInfoResponse } from '@/types/response';

// 안씀
const checkAuthCookie = async () => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken');
  const refreshToken = cookieStore.get('refreshToken');

  // 두개다 있는 경우
  if (accessToken && refreshToken) {
    let cookieString = '';

    if (accessToken) {
      cookieString += `${process.env.ACCESS_TOKEN}=${accessToken.value}; `;
    }
    if (refreshToken) {
      cookieString += `${process.env.REFRESH_TOKEN}=${refreshToken.value}; `;
    }

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + '/v1/user/info',
        {
          headers: {
            Cookie: cookieString,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const responseBody: UserInfoResponse = await response.json();

      return responseBody.status.success;
    } catch (e) {
      // refreshToken이 만료되었거나, accessToken이 만료된 경우
      // TODO: refresh token을 이용해서 accessToken을 갱신하는 로직 추가 필요
      console.log(e);
      return false;
    }
  }

  // accessToken이 없고 refreshToken이 있는 경우
  if (!accessToken && refreshToken) {
    // refreshToken이 만료되었거나, accessToken이 만료된 경우
    return false;
  }

  return false;
};

export default checkAuthCookie;
