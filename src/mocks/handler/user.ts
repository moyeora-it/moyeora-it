import { http, HttpResponse } from 'msw';
import { User } from '@/types';
import { Position, Skill } from '@/types/enums';
import { Group, GroupType } from '@/types';

export const userHandlers = [
  http.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/user/:id`,
    ({ params }) => {
      const { id } = params;

      if (id === '10') {
        return HttpResponse.json(null);
      }

      return HttpResponse.json<User>({
        userId: 1,
        email: 'test@test.com',
        nickname: '테스트닉네임',
        profileImage: 'https://github.com/shadcn.png',
        position: Position.FE,
        skills: [Skill.Java, Skill.JavaScript, Skill.Spring],
        rate: 4.5,
        isFollowing: false,
        isFollower: false,
      });
    },
  ),

  http.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/user/delete`, () => {
    if (Math.trunc(Math.random() * 100) % 2) {
      return HttpResponse.json({
        success: true,
        message: '회원 탈퇴 완료',
      });
    }
    return HttpResponse.json({
      success: false,
      message: '에러 메시지',
    });
  }),

  http.patch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/user/password`,
    async ({ request }) => {
      const body = (await request.json()) as {
        newPassword: string;
        confirmPassword: string;
      };
      console.log(body?.newPassword, body?.confirmPassword);
      return new HttpResponse(null, {
        status: Math.trunc(Math.random() * 100) % 2 === 0 ? 200 : 500,
      });
    },
  ),

  http.patch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/user/edit`,
    async ({ params, request }) => {
      const body = await request.formData();
      const nickname = body.get('nickname') as string;
      const position = JSON.parse(body.get('position') as string) as Position;
      const skills = JSON.parse(body.get('skills') as string) as Skill[];
      const file = body.get('file') as File;

      const imgSrc = file
        ? 'https://github.com/shadcn.png'
        : 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';

      return HttpResponse.json<User>({
        userId: Number(params.id),
        nickname,
        position,
        skills,
        profileImage: imgSrc,
        email: 'me@example.com',
        isFollowing: false,
        isFollower: false,
        rate: 4.5,
      });
    },
  ),

  http.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/groups`,
    ({ request }) => {
      const url = new URL(request.url);
      console.log(url);

      const items: Group[] = Array.from({ length: 10 }, () => ({
        id: Math.floor(Math.random() * 1000000) + 1,
        title: '스터디1',
        deadline: new Date('2025-05-22').toISOString(),
        startDate: new Date('2025-05-20').toISOString(),
        endDate: new Date('2025-05-24').toISOString(),
        maxParticipants: 10,
        participants: [],
        description: '스터디1 설명',
        position: [1, 3],
        skills: [1, 2],
        createdAt: new Date('2025-05-20'),
        type: GroupType.STUDY,
        autoAllow: true,
        isBookmark: false,
      }));

      return HttpResponse.json({
        hasNext: true,
        items,
        cursor: 10,
      });
    },
  ),
];
