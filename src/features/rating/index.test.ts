import { request } from "../../api/request";
import { setRating, updateRating } from "./index";
import { server } from '../../mocks/server';

describe("setRating", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(request, 'post');
    jest.spyOn(request, 'patch');
  });

  it("점수 등록이 성공하면 success: true를 반환한다", async () => {
    const targetUserId = 1;
    const rate = 4.5;
    const response = await setRating(targetUserId, rate);

    expect(request.post).toHaveBeenCalledWith(
      '/rating',
      { 'Content-Type': 'application/json' },
      JSON.stringify({ rate, targetUserId })
    );
    expect(response.result.success).toBe(true);
  });

  it("5점을 초과하는 평점을 등록하면 success: false를 반환한다", async () => {
    const targetUserId = 1;
    const rate = 5.5;  // 5점 초과

    const response = await setRating(targetUserId, rate);

    expect(request.post).toHaveBeenCalled();
    expect(response.result.success).toBe(false);
  });

  it("평점 수정이 성공하면 success: true를 반환한다", async () => {
    const ratingId = 1;
    const rate = 4.5;

    const response = await updateRating(ratingId, rate);

    expect(request.patch).toHaveBeenCalledWith(
      '/ratings',
      { rate },
      String(ratingId)
    );
    expect(response.result.success).toBe(true);
  });

});
