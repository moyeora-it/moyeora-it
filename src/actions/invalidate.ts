'use server';

import { revalidateTag } from 'next/cache';

/**
 * 주어진 태그에 연결된 서버 컴포넌트 캐시를 무효화합니다.
 * @param tag - fetch의 next: { tags } 옵션에서 사용한 태그 키
 */
export const invalidateTag = async (tag: string) => {
  await revalidateTag(tag);
};
