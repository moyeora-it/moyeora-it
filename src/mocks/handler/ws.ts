import { Server } from 'mock-socket';
import { eNotification } from '@/types/enums';

let mockServer: Server | null = null;

const getRandomNotificationType = () => {
  const enumLength = Object.keys(eNotification).length / 2; // enum은 키와 값이 양방향으로 매핑되어 실제 길이의 2배
  return Math.floor(Math.random() * enumLength);
};

const createMockNotification = (id: number) => {
  const type = getRandomNotificationType();
  console.log('type', type);
  let message = `알림 메시지 ${id}`;
  let url = '/v2/groups/1'; // 기본 URL

  switch (type) {
    case eNotification.GROUP_HAS_PARTICIPANT: 
      message = '새로운 참가자가 그룹에 참여했습니다.';
      url = '/v2/groups/1/participants';
      break;
    case eNotification.CONFIRMED_PARTICIPANT_CANCELED:
      message = '확정된 참가자가 취소했습니다.';
      url = '/v2/groups/1';
      break;
    case eNotification.APPLY_APPROVED:
      message = '모임 참가 신청이 승인되었습니다.';
      url = '/groups/1';
      break;
    case eNotification.APPLY_REJECTED:
      message = '모임 참가 신청이 거절되었습니다.';
      break;
    case eNotification.FULL_CAPACITY:
      message = '모임 정원이 마감되었습니다.';
      url = '/groups/1';
      break;
    case eNotification.FOLLOWER_ADDED:
      message = '새로운 팔로워가 추가되었습니다.';
      url = '/users/1';
      break;
    case eNotification.APPLY_CANCELED:
      message = '모임 신청이 취소되었습니다.';
      break;
    case eNotification.COMMENT_RECEIVED:
      message = '새로운 댓글이 달렸습니다.';
      url = '/groups/1#comment-1';
      break;
    case eNotification.FOLLOWER_CREATE_GROUP:
      message = '팔로우하는 사용자가 새 모임을 만들었습니다.';
      url = '/groups/1';
      break;
    case eNotification.REJECTED_GROUP:
      message = '모임 신청이 거절되었습니다.';
      break;
    case eNotification.WITHIN_24_HOUR:
      message = '북마크한 모임이 24시간 후에 시작됩니다.';
      url = '/groups/1';
      break;
  }

  return {
    type,
    notification: {
      id,
      message,
      url,
      isRead: false,
      createdAt: new Date().toISOString(),
    },
  };
};

// 목서버 생성
export const initMockSocket = () => {
  if (mockServer) {
    console.warn('mock 서버 이미 실행됨');
    return;
  }

  mockServer = new Server('ws://localhost:8080');

  mockServer.on('connection', socket => {
    console.log('mock 연결됨');
    let notificationId = 1;

    // 초기 알림 전송
    setTimeout(() => {
      socket.send(JSON.stringify(createMockNotification(notificationId++)));
    }, 2000);

    // 주기적으로 알림 전송 (5-15초 랜덤 간격)
    const sendRandomNotification = () => {
      const randomDelay = Math.floor(Math.random() * (15000 - 5000) + 5000);
      setTimeout(() => {
        socket.send(JSON.stringify(createMockNotification(notificationId++)));
        sendRandomNotification();
      }, randomDelay);
    };

    sendRandomNotification();

    // socket.on('message', data => {
    //   console.log('서버 수신:', data);
    //   socket.send('echo: ' + data);
    // });
  });
};