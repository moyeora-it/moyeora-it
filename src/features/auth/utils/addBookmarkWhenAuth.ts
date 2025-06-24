import { request } from '@/api/request';

// 북마크 정보를 로그인 후 서버에 저장하는 함수
const addBookmarkWhenAuth = async (bookmarkListStr: string) => {
  let bookmarkList: number[] = [];
  bookmarkList = JSON.parse(bookmarkListStr) as number[];

  try {
    // TODO: api 수정 요청
    await request.post(
      `/v2/bookmark/addids`,
      { 'Content-Type': 'application/json' },
      JSON.stringify({ groupIds: bookmarkList }),
      { credentials: 'include' },
    );

    // db에 북마크 추가 성공 후 로컬 스토리지에서 북마크 정보 삭제
    localStorage.removeItem('bookmarkList');
  } catch (e) {
    console.error('북마크 추가 중 오류 발생:', e);
  }
};

export default addBookmarkWhenAuth;
