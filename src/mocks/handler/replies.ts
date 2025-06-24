import { Reply } from '@/types';
import { http, HttpResponse } from 'msw';

const REPLY_LIST: Reply[] = Array.from({ length: 33 }, (_, i) => ({
  replyId: i + 1,
  content: `댓글 ${i + 1}`,
  writer: {
    userId: i + 1,
    nickname: `w${i + 1}`,
    profileImage: null,
    email: `w${i + 1}@gmail.com`,
  },
  createdAt: '2025-05-31T07:22:02.678Z',
  deleted: false,
}));

const REREPLY_LIST: (Reply & { parentId: number })[] = Array.from(
  { length: 500 },
  (_, i) => ({
    replyId: i + 1 + 10000,
    parentId: (i % REPLY_LIST.length) + 1,
    content: `대댓글 ${i + 1}`,
    writer: {
      userId: i + 1,
      nickname: `q${i + 1}`,
      profileImage: null,
      email: `q${i + 1}@gmail.com`,
    },
    createdAt: '2025-06-10T10:39:05.678Z',
    deleted: false,
  }),
);

export const repliesHandlers = [
  // 댓글 무한 스크롤로 가져오기
  http.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/groups/:groupId/replies`,
    ({ request }) => {
      const url = new URL(request.url);
      const cursorParam = url.searchParams.get('cursor');
      const sizeParam = url.searchParams.get('size');

      const cursor = cursorParam ? parseInt(cursorParam, 10) : 0;
      const size = sizeParam ? parseInt(sizeParam, 10) : 10;

      const foundIndex = REPLY_LIST.findIndex(
        (item) => item.replyId === cursor,
      );
      const startIndex =
        cursor === 0 ? 0 : foundIndex >= 0 ? foundIndex + 1 : REPLY_LIST.length;

      const paginatedItems = REPLY_LIST.slice(startIndex, startIndex + size);
      const nextCursor =
        startIndex + size < REPLY_LIST.length
          ? paginatedItems.at(-1)?.replyId
          : null;
      const hasNext = nextCursor !== null;

      return HttpResponse.json({
        items: paginatedItems,
        cursor: nextCursor,
        hasNext,
      });
    },
  ),
  // 대댓글 무한 스크롤로 가져오기
  http.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/groups/:groupId/replies/:replyId`,
    ({ request, params }) => {
      const url = new URL(request.url);
      const cursorParam = url.searchParams.get('cursor');
      const sizeParam = url.searchParams.get('size');

      const cursor = cursorParam ? parseInt(cursorParam, 10) : 0;
      const size = sizeParam ? parseInt(sizeParam, 10) : 10;
      const parentId = Number(params.replyId); // 부모 댓글 ID

      // 해당 부모 댓글에 달린 대댓글만 필터링
      const filtered = REREPLY_LIST.filter(
        (item) => item.parentId === parentId,
      );

      const foundIndex = filtered.findIndex((item) => item.replyId === cursor);
      const startIndex =
        cursor === 0 ? 0 : foundIndex >= 0 ? foundIndex + 1 : filtered.length;

      const paginatedItems = filtered.slice(startIndex, startIndex + size);
      const nextCursor =
        startIndex + size < filtered.length
          ? paginatedItems.at(-1)?.replyId
          : null;
      const hasNext = nextCursor !== null;

      return HttpResponse.json({
        items: paginatedItems,
        cursor: nextCursor,
        hasNext,
      });
    },
  ),
  // 댓글 추가
  http.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/groups/:groupId/replies`,
    async ({ request }) => {
      const body = (await request.json()) as { content: string };
      const { content } = body;

      const newId = REPLY_LIST.length + 1;
      const newReplyData = {
        replyId: newId,
        content,
        writer: {
          userId: newId,
          nickname: null,
          profileImage: null,
          email: `w${newId}@gmail.com`,
        },
        createdAt: '2025-05-23',
        deleted: false,
      };

      REPLY_LIST.push(newReplyData);

      return HttpResponse.json({
        replyId: newReplyData.replyId,
      });
    },
  ),
  // 대댓글 추가
  http.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/groups/:groupId/replies/:replyId`,
    async ({ request, params }) => {
      const body = (await request.json()) as { content: string };
      const { content } = body;

      const parentId = Number(params.replyId);
      const newId = REREPLY_LIST.length + 1 + 10000;
      const newRereplyData = {
        replyId: newId,
        parentId,
        content,
        writer: {
          userId: newId,
          nickname: `n${newId}`,
          profileImage: null,
          email: `n${newId}@gmail.com`,
        },
        createdAt: '2025-05-23',
        deleted: false,
      };

      REREPLY_LIST.push(newRereplyData);

      return HttpResponse.json({
        parentId: 10,
        replyId: newRereplyData.replyId,
      });
    },
  ),
  // 댓글, 대댓글 수정
  http.patch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/groups/:groupId/replies/:replyId`,
    async ({ request, params }) => {
      const body = (await request.json()) as { content: string };
      const { content } = body;

      const replyId = Number(params.replyId);

      // 댓글 수정
      const reply = REPLY_LIST.find((item) => item.replyId === replyId);

      if (reply) {
        reply.content = content;

        return HttpResponse.json({});
      }

      // 대댓글 수정
      const rereply = REREPLY_LIST.find((item) => item.replyId === replyId);

      if (rereply) {
        rereply.content = content;
        return HttpResponse.json({});
      }

      return new HttpResponse('해당 댓글을 찾을 수 없습니다.', { status: 404 });
    },
  ), // 댓글, 대댓글 삭제
  http.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/groups/:groupId/replies/:replyId`,
    async ({ params }) => {
      const replyId = Number(params.replyId);

      // 댓글 삭제
      const replyIdx = REPLY_LIST.findIndex((item) => item.replyId === replyId);

      if (replyIdx !== -1) {
        // 대댓글이 하나도 없으면 댓글 완전 삭제, 달려 있으면 content와 isDeleted만 변경
        if (REREPLY_LIST.some((item) => item.parentId === replyId)) {
          REPLY_LIST[replyIdx].content = '삭제된 댓글입니다.';
          REPLY_LIST[replyIdx].deleted = true;
        } else {
          REPLY_LIST.splice(replyIdx, 1);
        }

        return HttpResponse.json({});
      }

      // 대댓글 삭제
      const rereplyIdx = REREPLY_LIST.findIndex(
        (item) => item.replyId === replyId,
      );

      if (rereplyIdx !== -1) {
        const parentReplyIdx = REPLY_LIST.findIndex(
          (item) => item.replyId === REREPLY_LIST[rereplyIdx].parentId,
        );

        // 대댓글 삭제
        REREPLY_LIST.splice(rereplyIdx, 1);

        // 부모 댓글도 삭제된 상태면 부모 댓글도 완전 삭제
        if (
          REPLY_LIST[parentReplyIdx].deleted &&
          REREPLY_LIST.some((item) => item.parentId === replyId)
        ) {
          REPLY_LIST.splice(replyIdx, 1);
        }

        return HttpResponse.json({});
      }

      // 못 찾으면 404
      return new HttpResponse('해당 댓글을 찾을 수 없습니다.', { status: 404 });
    },
  ),
];
