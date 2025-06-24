import { http, HttpResponse } from 'msw';

export const applicationsHandlers = [
  http.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/groups/:groupId/applications`,
    () => {
      return HttpResponse.json({});
    },
  ),
  http.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/groups/:groupId/applications`,
    () => {
      return HttpResponse.json({});
    },
  ),
];
