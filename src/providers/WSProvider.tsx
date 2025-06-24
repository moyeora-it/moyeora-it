// providers/WebSocketProvider.tsx
'use client';

import useAuthStore from '@/stores/useAuthStore';
import useNotificationStore from '@/stores/useNotificationStore';
import { eNotification } from '@/types/enums';
import { createContext, useContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

type SocketMessage = {
  id: number;
  message: string;
  notificationType: keyof typeof eNotification;
  targetUserId: number;
  url: string;
};

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const user = useAuthStore((state) => state.user);

  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!user) {
      socket?.disconnect();
      setSocket(null);
      return;
    }
    const newSocket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      withCredentials: true,
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });

    // 연결 이벤트 핸들러
    newSocket.on('connect', () => {
      console.log('socket.io 연결됨', user.userId);
      // 로그인 이벤트에 콜백 추가
      newSocket.emit('login', user.userId);
      newSocket.on('loginSuccess', (response: { userId: number }) => {
        console.log('서버 응답:', response.userId);
        if (response.userId !== user.userId) {
          newSocket.disconnect();
          setSocket(null);
          return;
        }
      });
    });

    // 메시지 이벤트 핸들러 - connect 밖에서 등록
    newSocket.on('notification', (message: SocketMessage) => {
      addNotification({
        id: Math.random(),
        message: message.message,
        isRead: false,
        createdAt: new Date(),
        type: eNotification[
          message.notificationType as keyof typeof eNotification
        ],
        url: message.url,
      });
      console.log('messageC 이벤트 발생!', message);
      console.log('store', useNotificationStore.getState().notifications);

      console.log('받은 메시지 상세:', {
        notificationType: message.notificationType,
        targetUserId: message.targetUserId,
        url: message.url,
      });
    });

    newSocket.connect();
    setSocket(newSocket);

    return () => {
      newSocket.removeAllListeners(); // 모든 리스너 제거
      newSocket.disconnect();
    };
    // eslint-disable-next-line
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
