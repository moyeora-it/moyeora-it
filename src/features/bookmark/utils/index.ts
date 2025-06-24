/** localStorage에서 찜 목록을 조회하는 함수 */
export const getBookmarkList = () => {
  let bookmarkList: number[] = [];
  const bookmarkListStr = localStorage.getItem('bookmarkList');

  if (bookmarkListStr !== null) {
    bookmarkList = JSON.parse(bookmarkListStr) as number[];
  }

  return bookmarkList;
};

/** 해당 요소를 localStorage 찜 목록에 추가하는 함수 */
export const addBookmarkItem = (itemId: number) => {
  const bookmarkList = getBookmarkList();
  bookmarkList.push(itemId);
  localStorage.setItem('bookmarkList', JSON.stringify(bookmarkList));
};

/** 해당 요소를 localStorage 찜 목록에서 제거하는 함수 */
export const removeBookmarkItem = (itemId: number) => {
  let bookmarkList = getBookmarkList();
  bookmarkList = bookmarkList.filter((bookmark) => bookmark !== itemId);
  localStorage.setItem('bookmarkList', JSON.stringify(bookmarkList));
};
