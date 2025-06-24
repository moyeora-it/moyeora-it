import { NOTIFICATIONS } from '@/mocks/handler/notifications';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import useNotificationStore from './useNotificationStore';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useNotificationStore 테스트', () => {
  it('clearAllNotifications: 서버에 DELETE 요청 후 상태 초기화', async () => {
    server.use(
      http.delete('/api/v1/notification', () => {
        return HttpResponse.json({ result: { success: true } });
      })
    );
    
    useNotificationStore.setState({
      notifications: NOTIFICATIONS.map(n => ({ 
        ...n, 
        createdAt: new Date(n.createdAt),
        url: n.url ?? null 
      })),
      unreadCount: 1,
    });

    await useNotificationStore.getState().clearAllNotifications();

    const { notifications, unreadCount } = useNotificationStore.getState();
    expect(notifications).toEqual([]);
    expect(unreadCount).toBe(0);
  });

  it('읽음 처리 후 안 읽은 알림 개수 감소', () => {
    useNotificationStore.setState({
      notifications: NOTIFICATIONS.map(n => ({ 
        ...n, 
        createdAt: new Date(n.createdAt),
        url: n.url ?? null 
      })),
      unreadCount: 1,
    });

    useNotificationStore.getState().setReadNotification(NOTIFICATIONS[0].id);

    const { unreadCount } = useNotificationStore.getState();
    expect(unreadCount).toBe(0);
  });
});