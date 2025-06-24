import { http, HttpResponse } from 'msw';

type RatingBody = {
  targetUserId?: number;
  rate: number;
}

export const ratingHandlers = [
  http.post('http://localhost:4000/api/rating', async ({ request }) => {
    const body = await request.json() as RatingBody;
    const { rate } = body;

    if (rate > 5) {
      return HttpResponse.json({
        result: {
          success: false,
          message: '평점은 5점을 초과할 수 없습니다.'
        }
      });
    }

    return HttpResponse.json({
      result: {
        success: true,
      },
    });
  }),

  http.patch('http://localhost:4000/api/ratings/:id', async ({ request, params }) => {
    const body = await request.json() as RatingBody;
    const { rate } = body;
    const { id } = params;

    console.log('받은 평점 수정 요청:', { id, rate });

    if (rate > 5) {
      return HttpResponse.json({
        result: {
          success: false,
          message: '평점은 5점을 초과할 수 없습니다.'
        }
      });
    }

    return HttpResponse.json({
      result: {
        success: true,
      },
    });
  }),
];
