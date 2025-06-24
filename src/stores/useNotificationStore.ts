import { create } from 'zustand';
import { Notification } from '@/types';
import { request } from '@/api/request';

export type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  }

export type NotificationActions = {
	init: () => void;
  addNotification: (notification: Notification) => void;
  setNotifications: (notifications: Notification[]) => void;
  setReadNotification: (id: number) => void;
  setUnreadCount: (count: number) => void;
  clearAllNotifications: () => Promise<void>;
}

type NotificationStore = NotificationState & NotificationActions;

const useNotificationStore = create<NotificationStore>((set, get) => ({
	notifications: [],
	unreadCount: 0,
	addNotification: (notification: Notification) => {
    const { notifications } = get();
    const exists = notifications.some(n => n?.id === notification.id); // 이미 같은 ID의 알림이 있는지 확인
    
    if (exists) return; // 이미 존재하면 상태 변경 없음
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
	},
  setNotifications: (notifications: Notification[]) => set(() => ({
    notifications,
  })),
  setReadNotification: async (id: number) => {
    const { notifications } = get();
    await request.patch(`/v1/notification/${id}/read`, {},{}, { credentials: 'include' });
    set((state) => {
      const updatedNotifications = notifications.map((notification: Notification) => ({
        ...notification,
        isRead: notification.id === id ? true : notification.isRead,
      }));
      return {
        unreadCount: state.unreadCount - 1,
        notifications: updatedNotifications,
      };
    });
  },
  setUnreadCount: (count: number) => set(() => ({
    unreadCount: count,
  })),
  clearAllNotifications: async () => {
    console.log('clearAllNotifications');
    await fetch('/api/v1/notification', { method: 'DELETE' });
    set(() => ({
      notifications: [],
      unreadCount: 0,
    }));
  },
	init: () => set(() => ({
      notifications: [],
      unreadCount: 0,
    })),
}));

export default useNotificationStore;
