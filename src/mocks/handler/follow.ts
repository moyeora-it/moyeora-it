import { http, HttpResponse } from 'msw';
import { User } from '@/types';

export const followHandlers = [
  http.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/:userId/followings`,
    ({ request }) => {
      const url = new URL(request.url);
      const searchParams = new URLSearchParams(url.search);
      const search = searchParams.get('search');
      console.log('in handler', search);

      const items: User[] = Array.from({ length: 10 }).map((_, index) => {
        return {
          userId: index + 1,
          email: `test${index + 1}@gmail.com`,
          nickname: `테스트 닉네임${index + 1}`,
          profileImage: `https://github.com/shadcn.png`,
          position: 1,
          skills: [1, 2, 3],
          isFollowing: true,
          isFollower: true,
          rate: 4,
        };
      });

      return HttpResponse.json({
        hasNext: true,
        cursor: 1,
        items,
      });
    },
  ),

  http.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/:userId/followers`,
    ({ request }) => {
      const url = new URL(request.url);
      const searchParams = new URLSearchParams(url.search);
      const search = searchParams.get('search');
      console.log('in handler', search);

      const items: User[] = Array.from({ length: 10 }).map((_, index) => {
        return {
          userId: index + 1,
          email: `test${index + 1}@gmail.com`,
          nickname: `테스트 닉네임${index + 1}`,
          profileImage: `https://github.com/shadcn.png`,
          position: 1,
          skills: [1, 2, 3],
          isFollowing: true,
          isFollower: true,
          rate: 4,
        };
      });

      return HttpResponse.json({
        hasNext: true,
        cursor: 1,
        items,
      });
    },
  ),

  http.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/:userId/follow`,
    () => {
      return HttpResponse.json({
        message: '팔로우 성공',
      });
    },
  ),

  http.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/:userId/unfollow`,
    () => {
      return HttpResponse.json({
        message: '언팔로우 성공',
      });
    },
  ),

  http.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/:userId/unfollower`,
    () => {
      return HttpResponse.json({
        message: '팔로워 삭제 성공',
      });
    },
  ),

  http.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/:userId/followers/count`,
    () => {
      return HttpResponse.json({
        count: 100,
      });
    },
  ),

  http.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/:userId/followings/count`,
    () => {
      return HttpResponse.json({
        count: 50,
      });
    },
  ),
];
