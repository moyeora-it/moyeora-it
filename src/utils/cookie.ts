import { cookies } from 'next/headers';

export const getAuthCookieHeader = async () => {
  const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN ?? 'accessToken';
  const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN ?? 'refreshToken';

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_KEY);
  const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY);

  return [
    accessToken && `${ACCESS_TOKEN_KEY}=${accessToken.value}`,
    refreshToken && `${REFRESH_TOKEN_KEY}=${refreshToken.value}`,
  ]
    .filter(Boolean)
    .join('; ');
};
