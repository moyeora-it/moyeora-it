import { server } from '@/mocks/server';
import useAuthStore from '@/stores/useAuthStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { Suspense } from 'react';
import { NotificationList } from '.';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>{ui}</Suspense>
    </QueryClientProvider>,
  );
};

const mockUser = {
  userId: 1,
  email: 'test@test.com',
  nickname: 'Test User',
  profileImage: null,
  position: null,
  skills: null,
  isFollowing: false,
  isFollower: false,
  rate: 0,
};

describe('알람 목록 컴포넌트 테스트', () => {
  beforeAll(() => {
    server.listen();
    useAuthStore.setState({ user: mockUser });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it('안 읽은 알람이 1개 이상인 경우 badge가 표시된다', async () => {
    // Set cookie before making requests
    document.cookie = 'accessToken=test-token';

    server.use(
      http.get('/api/notification', () => {
        return HttpResponse.json({ items: [] });
      }),

      http.get('/api/notification/unread-count', () => {
        return HttpResponse.json({ unreadCount: 1 });
      }),
    );

    renderWithClient(<NotificationList />);

    const badge = await screen.findByRole('status');
    expect(badge).toBeInTheDocument();
  });

  it('로그인이 안된 경우 list가 렌더링 되지 않는다', async () => {
    useAuthStore.setState({ user: null });
    renderWithClient(<NotificationList />);

    //비동기 컴포넌트라 wait
    await waitFor(() => {
      expect(screen.queryByText('Notification')).not.toBeInTheDocument();
    });
  });
});
