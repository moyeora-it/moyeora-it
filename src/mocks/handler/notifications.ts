import { Notification } from '@/types';
import { eNotification } from '@/types/enums';
import { InfiniteResponse } from '@/types/response';
import { http, HttpResponse } from 'msw';

export const NOTIFICATIONS = [
  {
    id: 9999,
    message: '알림 메시지1',
    isRead: false,
    createdAt: '2025-05-20',
    type: eNotification.GROUP_HAS_PARTICIPANT,
    url: 'http://localhost:3000/groups/1',
  },
  {
    id: 9998,
    message: '알림 메시지2',
    isRead: true,
    createdAt: '2025-05-20',
    type: eNotification.FOLLOWER_ADDED,
  },
];

export const notificationsHandlers = [
  http.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/notifications`,
    ({ request }) => {
      const url = new URL(request.url);
      const searchParams = new URLSearchParams(url.search);
      const isRead = searchParams.get('isRead');

      const filteredNotifications = NOTIFICATIONS.filter((notification) => {
        return isRead === 'false' ? !notification.isRead : true;
      }).map((notification) => ({
        ...notification,
        createdAt: new Date(notification.createdAt),
        url: notification.url ?? null,
      }));

      return HttpResponse.json<InfiniteResponse<Notification>>({
        status: {
          code: 200,
          message: 'success',
          success: true,
        },
        data: filteredNotifications,
        hasNext: false,
        cursor: 0,
      });
    },
  ),
  http.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/notifications/unread-count`,
    () => {
      return HttpResponse.json({
        unreadCount: 1,
      });
    },
  ),
];
