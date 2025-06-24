import { request } from '@/api/request';
import { groupsHandlers } from '@/mocks/handler/groups';
import { GroupType, WriteFormWithCreatedAt } from '@/types';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(...groupsHandlers);

// 모든 테스트가 시작하기 전 MSW 서버를 시작합니다.
beforeAll(() => server.listen());
// 이전 테스트의 모의 응답이 다음 테스트에 영향을 주지 않도록 이전 테스트에서 설정된 핸들러를 초기화합니다.
afterEach(() => server.resetHandlers());
// 모든 테스트가 완료된 후에 MSW 서버를 종료합니다.
afterAll(() => server.close());

describe('write form 테스트', () => {
  const tempBody: WriteFormWithCreatedAt = {
    title: '스터디 만들기',
    maxParticipants: 10,
    deadline: new Date(2024, 5, 26),
    startDate: new Date(2024, 5, 27),
    endDate: new Date(2024, 6, 26),
    description:
      '<div><h1>재밌는 Next.js 스터디</h1><div>같이해보아요</div></div>',
    autoAllow: false,
    type: GroupType.STUDY,
    skills: ['Typescript', 'Next.js'],
    position: ['FE'],
    createdAt: new Date(2024.05, 26),
  };

  test('group이 정상적으로 생성되었을 시 { success: true }를 받는다', async () => {
    const result = await request.post(
      '/v2/groups',
      { 'Content-Type': 'application/json' },
      JSON.stringify(tempBody),
    );

    expect(result).toEqual({ success: true });
  });

  test('group 생성 시 응답은 왔지만 에러가 발생한 경우 { success: false, code: 400 }를 받는다', async () => {
    server.use(
      http.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/group`, () => {
        return HttpResponse.json(
          { success: false, code: 400 },
          { status: 200 },
        );
      }),
    );

    const result = await request.post(
      '/v2/groups',
      { 'Content-Type': 'application/json' },
      JSON.stringify(tempBody),
    );

    expect(result).toEqual({ success: false, code: 400 });
  });

  test('group 생성 시 서버 에러가 발생한 경우 Unexpected Error를 받는다', async () => {
    server.use(
      http.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/group`, () => {
        return HttpResponse.json(
          { message: 'Bad Request' },
          { status: 400 }, // 400 상태코드 -> response.ok === false
        );
      }),
    );

    const result = request.post(
      '/v2/groups',
      { 'Content-Type': 'application/json' },
      JSON.stringify(tempBody),
    );

    await expect(result).rejects.toThrow('Unexpected Error');
  });
});
