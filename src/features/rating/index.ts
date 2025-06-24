import { request } from '@/api/request';

export const setRating = async (targetUserId: number, rate: number) => {
  return await request.post(
    '/rating',
    {
      'Content-Type': 'application/json',
    },
    JSON.stringify({
      rate,
      targetUserId,
    }),
  );
};

export const updateRating = async (ratingId: number, rate: number) => {
  return await request.patch(
    `/ratings/${String(ratingId)}`,
    { 'Content-Type': 'application/json' },
    { rate },
  );
};
