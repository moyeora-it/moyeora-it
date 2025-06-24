import { http, HttpResponse } from 'msw';
import { User } from '@/types';
import { Position, Skill } from '@/types/enums';

let user: User = {
  userId: 1,
  email: 'me@example.com',
  nickname: null,
  position: null,
  skills: null,
  profileImage: null,
  isFollower: false,
  isFollowing: true,
  rate: 4,
};

export const authenticationsHandlers = [
  http.post('http://localhost:4000/api/login', () => {
    return new HttpResponse(JSON.stringify({ success: true }), {
      headers: new Headers([
        ['Set-Cookie', 'accessToken=myAccess; Path=/'],
        ['Set-Cookie', 'refreshToken=myRefresh; Path=/'],
      ]),
    });
  }),
  http.post('http://localhost:4000/api/register', () => {
    return new HttpResponse(JSON.stringify({ success: true }), {
      headers: new Headers([
        ['Set-Cookie', 'accessToken=myAccess; Path=/'],
        ['Set-Cookie', 'refreshToken=myRefresh; Path=/'],
      ]),
    });
  }),
  http.get('http://localhost:4000/api/me', () => {
    return HttpResponse.json<{ user: User }>({
      user,
    });
  }),
  http.post('http://localhost:4000/api/me', async ({ request }) => {
    const body = (await request.json()) as {
      nickname: string;
      position: Position;
      skills: Skill[];
    };

    user = {
      ...user,
      nickname: body.nickname,
      position: body.position,
      skills: body.skills,
    };

    return HttpResponse.json({
      success: true,
    });
  }),
  http.post('http://localhost:4000/api/find-email', () => {
    return HttpResponse.json({
      success: true,
    });
  }),
  http.post('http://localhost:4000/api/find-password', () => {
    return HttpResponse.json({
      success: true,
    });
  }),
  http.post('http://localhost:4000/api/logout', () => {
    return new HttpResponse(JSON.stringify({ success: true }), {
      headers: new Headers([
        [
          'Set-Cookie',
          'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        ],
        [
          'Set-Cookie',
          'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        ],
      ]),
    });
  }),
];
