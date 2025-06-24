import { request } from '@/api/request';
import { User } from '@/types';
import { UserInfoResponse } from '@/types/response';

// ISSUE: 스토어에 넣으면 좋을거 같아요 일단 제가 작업한거라 분리해뒀어요
export const fetchAndSetUser = async (
  setUser: (user: User) => void,
): Promise<void> => {
  try {
    const responseBody: UserInfoResponse = await request.get(
      '/v1/user/info',
      {},
      {
        credentials: 'include',
      },
    );

    if (responseBody.status.success) {
      setUser({
        //@ts-expect-error 백엔드에서 제공하는 타입이 이상해서 임시로 처리
        userId: responseBody.items.items.id,
        ...responseBody.items.items,
      });
    } else {
      throw new Error('유저 정보 불러오기 실패');
    }
  } catch (error) {
    console.error('유저 정보 불러오기 실패', error);
    // 필요시 에러 처리 로직 추가
    throw error;
  }
};
