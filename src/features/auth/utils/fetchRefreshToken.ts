'use client';

// 무조건 클라이언트에서
// 성공 여부를 반환하는 함수
const fetchRefreshToken = async () => {
  try {
    // 쿠키를 새로고침하기 위한 요청
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + '/v1/user/refresh',
      {
        method: 'POST',
        credentials: 'include', // 쿠키를 포함하여 요청
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('토큰 갱신 요청 실패');
    }

    const {
      status: { success },
    } = await response.json();

    if (!success) {
      throw new Error('토큰 갱신 실패');
    }

    return success as boolean;
  } catch (error) {
    console.error('token 새로 고침 중 오류 발생:', error);
    return false;
  }
};

export default fetchRefreshToken;
