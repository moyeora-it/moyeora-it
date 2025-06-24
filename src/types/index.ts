//전역 파일 타입 정리
import { eNotification, Position, Skill } from './enums';

export type User = {
  userId: number;
  nickname: string | null;
  email: string;
  profileImage: string | null;
  position: Position | null;
  skills: Skill[] | null;
  isFollowing: boolean;
  isFollower: boolean;
  rate: number;
};

export type UserSummary = Pick<
  User,
  'userId' | 'nickname' | 'profileImage' | 'email'
>;

export enum GroupType {
  STUDY = 'study',
  PROJECT = 'project',
}
export const GroupTypeName = {
  study: '스터디',
  project: '프로젝트',
};

export type WriteFormWithCreatedAt = WriteForm & { createdAt: Date };
/** 제공해주는 기본 skill의 이름들. enum Skill과 동기화되어야 함 */
export const DEFAULT_SKILL_NAMES = [
  'Java',
  'JavaScript',
  'HTML_CSS',
  'REACT',
  'Vue',
  'Kotlin',
  'Spring',
] as const;
/** 제공해주는 기본 skill의 이름들의 타입. UI용 */
export type DefaultSkillName = (typeof DEFAULT_SKILL_NAMES)[number];
/** 유저가 입력한 skill도 사용하기 위해 만든 타입. UI용 */
export type SkillName = DefaultSkillName | string;

/** 제공해주는 기본 position의 이름들. enum Position과 동기화되어야 함 */
export const DEFAULT_POSITION_NAMES = [
  'PM',
  'PL',
  'AA',
  'TA',
  'DA',
  'QA',
  'FE',
  'BE',
  'FS',
] as const;
/** 제공해주는 기본 position의 이름들의 타입. UI용 */
export type DefaultPositionName = (typeof DEFAULT_POSITION_NAMES)[number];
/** 유저가 입력한 skill도 사용하기 위해 만든 타입. UI용 */
export type PositionName = DefaultPositionName | string;

/** 모임 만들기 폼에 사용되는 데이터들의 타입 */
export type WriteForm = {
  title: string;
  maxParticipants: number;
  deadline: Date;
  startDate: Date;
  endDate: Date;
  description: string;
  autoAllow: boolean;
  type: GroupType;
  skills: SkillName[];
  position: PositionName[];
};

export type Group = {
  id: number;
  title: string;
  deadline: string;
  startDate: string; // 모임의 시작일
  endDate: string; // 모임의 종료일
  maxParticipants: number;
  participants: UserSummary[];
  description: string;
  position: Position[];
  skills: Skill[];
  createdAt: Date;
  isBookmark: boolean;
  autoAllow: boolean;
  type: GroupType;
};

export type GroupSort = 'createdAt' | 'deadline';

export type Order = 'asc' | 'desc';

export type Notification = {
  id: number;
  message: string | null; // 추후 채팅의 경우 가장 간략한 채팅메세지 전달용 현재는 빈값으로 리턴
  content?: string | null; // TODO: socket, notification 타입 통일 후 제거
  isRead: boolean; // 읽음 여부 default: false
  read?: boolean; // TODO: socket, notification 타입 통일 후 제거
  created_at?: Date; // 알람 생성날짜
  createdAt: Date; // 알람 생성날짜
  type: eNotification;
  url: string | null; // 연결되는 url -> NotificationType에 따라 필요한 부분 다름
};

export type Reply = {
  replyId: number;
  content: string;
  writer: UserSummary;
  createdAt: string;
  deleted: boolean; // 삭제된 댓글인지 여부
};

export type GroupDetail = {
  group: {
    id: number;
    title: string;
    description: string;
    autoAllow: boolean;
    maxParticipants: number;
    type: GroupType;
    skills: Skill[];
    position: Position[];
    deadline: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    participants: UserSummary[];
    isBookmark: boolean;
  };
  host: UserSummary;
  isApplicant: boolean;
  isJoined: boolean;
};
