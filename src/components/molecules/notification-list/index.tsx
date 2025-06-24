import { request } from '@/api/request';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useFetchInView } from '@/hooks/useFetchInView';
import { useFetchItems } from '@/hooks/useFetchItems';
import useAuthStore from '@/stores/useAuthStore';
import useNotificationStore from '@/stores/useNotificationStore';
import { Notification as NotificationType } from '@/types/index';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { NotificationItem } from '../../atoms/notification-item';

const NotificationPageSchema = z.object({
  status: z.object({
    success: z.boolean(),
  }),
  notifications: z.object({
    hasNext: z.boolean(),
    cursor: z.number().nullable(),
    items: z.array(z.any()),
  }),
});

export const NotificationList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setNotifications, setUnreadCount } = useNotificationStore();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const notifications = useNotificationStore((state) => state.notifications);
  const user = useAuthStore((state) => state.user);

  // 전체 알림 목록 조회
  // TODO: 백엔드 데이터 타입 고쳐야됨 - 프젝 끝나고 고칠예정
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFetchItems({
      url: '/v1/notification',
      getNextPageParam: (lastPage) => {
        const page = NotificationPageSchema.parse(lastPage);
        return page.notifications.hasNext ? page.notifications.cursor : null;
      },
    });

  // 안 읽은 알림 목록 조회
  const { data: unreadData, isLoading: isUnreadLoading } = useQuery<{
    unreadCount: number;
  }>({
    queryKey: ['unread-count'],
    queryFn: async () => {
      return await request.get(
        '/v1/notification/unread-count',
        {},
        {
          credentials: 'include',
        },
      );
    },
  });

  const { ref } = useFetchInView({
    fetchNextPage,
    isLoading: isUnreadLoading,
    isFetchingNextPage,
  });

  const normalizeNotification = (
    item: Record<string, unknown>,
  ): NotificationType => {
    const { content, created_at, createdAt, isRead, read, message, ...rest } =
      item as Partial<NotificationType>;
    return {
      ...rest,
      message: content || message,
      isRead: !!(isRead || read),
      createdAt: createdAt || created_at,
    } as NotificationType;
  };

  useEffect(() => {
    if (!data) return;

    const allPages = data.pages.map((page) => {
      const result = NotificationPageSchema.safeParse(page);
      if (result.success) {
        return result.data.notifications.items ?? [];
      }
      return [];
    });

    const newItems = allPages.flat().map(normalizeNotification);
    setNotifications(newItems);
    // eslint-disable-next-line
  }, [data]);

  // 안 읽은 알람 업데이트
  useEffect(() => {
    if (!unreadData) return;
    setUnreadCount(Number(unreadData.unreadCount) || 0);
  }, [unreadData, setUnreadCount]);

  const openhandler = (open: boolean) => {
    setIsOpen(open);
  };

  const renderNotificationItems = () =>
    notifications.map(
      (notification: NotificationType, idx: number) =>
        notification && (
          <div
            key={notification.id}
            ref={idx === notifications.length - 1 ? ref : undefined}
          >
            <NotificationItem
              notification={notification}
              onClose={() => setIsOpen(false)}
            />
          </div>
        ),
    );

  if (!user) return null;

  return (
    <Popover open={isOpen} onOpenChange={openhandler}>
      <PopoverTrigger className="relative">
        <div className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
          <Image
            src={`/icons/alarm-${unreadCount > 0 ? 'active' : 'default'}.svg`}
            alt="알림"
            width={24}
            height={24}
            className="opacity-70"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 shadow-lg" align="end">
        <div className="flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700">알림</h4>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length ? (
              renderNotificationItems()
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Image
                  src="/icons/alarm-default.svg"
                  alt="빈 알림"
                  width={32}
                  height={32}
                  className="opacity-50 mb-2"
                />
                <p className="text-sm">알림이 없습니다</p>
              </div>
            )}
            {hasNextPage && <div ref={ref} className="h-4" />}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
