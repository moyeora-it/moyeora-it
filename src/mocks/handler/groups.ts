import { Group, GroupSort, Order } from '@/types';
import { Position, Skill } from '@/types/enums';
import {
  getRandomItem,
  getRandomItems,
  groupTypeValues,
  positionKeys,
  skillKeys,
} from '@/utils/mockUtils';
import { addDays } from 'date-fns';
import { http, HttpResponse } from 'msw';

const titles = [
  'React 스터디',
  'Node.js 모임',
  'TypeScript 스터디',
  'Next.js 클럽',
  '프론트엔드 개발자 그룹',
  '백엔드 마스터즈',
  '풀스택 프로젝트팀',
  '알고리즘 마라톤',
  'UI/UX 디자인 스터디',
  '데이터 사이언스 클럽',
];

const GROUP_LIST = [
  {
    title: '스터디1',
    deadline: '2025-05-24',
    startDate: '2025-05-20',
    endDate: '2025-05-24',
    maxParticipants: 10,
    description:
      '<h1 class="text-xl font-bold capitalize text-green-700" levels="2">Next.js 스터디</h1><ul class="list-disc ml-2"><li><p>온라인으로 진행</p></li><li><p>오후 7시</p></li></ul><p></p><p>—완료—</p><h2 class="text-xl font-bold capitalize" levels="2"></h2>',
    position: [1, 3],
    skills: [1, 2],
    createdAt: '2025-05-20',
    type: 'study',
    autoAllow: true,
    host: {
      userId: 'abcd123',
      nickname: '사용자1',
      profileImage: 'https://github.com/shadcn.png',
      email: 'qwerty@gmail.com',
    },
    isApplicant: false,
    isBookmark: false,
    participants: [
      {
        userId: 'abcd1',
        nickname: '팀원1',
        profileImage: null,
        email: 'member1@gmail.com',
      },
      {
        userId: 'abcd12',
        nickname: null,
        profileImage: 'https://github.com/shadcn.png',
        email: 'member2@gmail.com',
      },
      {
        userId: 'abcd123',
        nickname: '팀원3',
        profileImage: 'https://github.com/shadcn.png',
        email: 'member3@gmail.com',
      },
      {
        userId: 'abcd1234',
        nickname: '팀원4',
        profileImage: 'https://github.com/shadcn.png',
        email: 'member4@gmail.com',
      },
      {
        userId: 'abcd1235',
        nickname: null,
        profileImage: 'https://github.com/shadcn.png',
        email: 'member5@naver.com',
      },
    ],
  },
];

export const groupsHandlers = [
  http.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/groups`, ({ request }) => {
    const url = new URL(request.url);

    const typeParam = url.searchParams.get('type');
    const skillParam = url.searchParams.get('skill');
    const skillNumber = skillParam ? Number(skillParam) : null;
    const positionParam = url.searchParams.get('position');
    const positionNumber = positionParam ? Number(positionParam) : null;
    const searchKeyword = url.searchParams.get('search')?.toLowerCase() ?? '';
    const sortParam = url.searchParams.get('sort') as GroupSort | null;
    const orderParam = url.searchParams.get('order') as Order | null;

    const cursorParam = url.searchParams.get('cursor');
    const cursor = cursorParam ? Number(cursorParam) : 0;
    const limit = 10; // 페이지당 아이템 수

    const allItems: Group[] = Array.from({ length: 100 }, (_, index) => {
      const offset = index * 2;
      const baseDate = new Date(2025, 4, 26);
      const createdAt = addDays(baseDate, offset);
      const deadline = addDays(baseDate, offset + 1).toISOString();
      const startDate = addDays(baseDate, offset + 5).toISOString();
      const endDate = addDays(baseDate, offset + 10).toISOString();

      const positions = getRandomItems(
        positionKeys,
        Math.floor(Math.random() * 3) + 1,
      ).map((key) => Position[key]);
      const skills = getRandomItems(
        skillKeys,
        Math.floor(Math.random() * 3) + 1,
      ).map((key) => Skill[key]);
      const type = getRandomItem(groupTypeValues.slice(0, 2));

      const maxParticipants = Math.floor(Math.random() * (30 - 2 + 1)) + 2;
      const participants = Array.from(
        { length: Math.floor(Math.random() * maxParticipants) },
        () => ({
          userId: 1,
          nickname: '모여라잇유저',
          profileImage: null,
          email: 'user@yopmail.com',
        }),
      );

      const title = titles[index % titles.length];

      return {
        id: index + 1,
        title,
        description: `<h2 class="text-xl font-bold capitalize">${title} 모집합니다</h2><p>모두 즐겁게 공부해요!</p>`,
        position: positions,
        skills: skills,
        participants,
        maxParticipants,
        autoAllow: true,
        isBookmark: false,
        createdAt,
        deadline,
        startDate,
        endDate,
        type,
      };
    });

    const typeFiltered = typeParam
      ? allItems.filter((item) => item.type === typeParam)
      : allItems;
    const skillFiltered =
      skillNumber !== null
        ? typeFiltered.filter((item) => item.skills.includes(skillNumber))
        : typeFiltered;
    const positionFiltered =
      positionNumber !== null
        ? skillFiltered.filter((item) => item.position.includes(positionNumber))
        : skillFiltered;
    const searchFiltered = searchKeyword
      ? positionFiltered.filter((item) =>
          item.title.toLowerCase().includes(decodeURIComponent(searchKeyword)),
        )
      : positionFiltered;

    const sortedItems = [...searchFiltered].sort((a, b) => {
      if (!sortParam) return 0;
      const aDate = new Date(a[sortParam]);
      const bDate = new Date(b[sortParam]);
      if (orderParam === 'asc') return aDate.getTime() - bDate.getTime();
      if (orderParam === 'desc') return bDate.getTime() - aDate.getTime();
      return 0;
    });

    const paginatedItems = sortedItems.slice(cursor, cursor + limit);
    const nextCursor =
      cursor + limit < sortedItems.length ? cursor + limit : null;

    return HttpResponse.json({
      items: paginatedItems,
      hasNext: nextCursor !== null,
      cursor: nextCursor,
    });
  }),
  http.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/groups`, () => {
    return HttpResponse.json({
      success: true,
    });
  }),
  http.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/groups/:id`, () => {
    return HttpResponse.json(GROUP_LIST[0]);
  }),
  http.patch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookmark`,
    async ({ request }) => {
      const body = (await request.json()) as {
        id: number;
        isBookmark: boolean;
      };
      const { id, isBookmark } = body;

      GROUP_LIST[0].isBookmark = isBookmark;

      if (id === 2) {
        return HttpResponse.json({}, { status: 400 });
      }

      return HttpResponse.json({});
    },
  ),
  http.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/groups/:id`, () => {
    return HttpResponse.json({});
  }),
];
