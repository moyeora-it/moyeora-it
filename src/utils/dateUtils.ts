import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
  isBefore,
} from 'date-fns';

/** 날짜를 0000.00.00 형태로 반환하는 함수 */
export const formatYearMonthDayWithDot = (utcTime: string | Date) => {
  const date = typeof utcTime === 'string' ? new Date(utcTime) : utcTime;
  return format(date, 'yyyy.MM.dd');
};

/** 현재 날짜보다 이전날짜인지 확인 */
export const isBeforeToday = (utcTime: string) => {
  const date = new Date(utcTime);
  const now = new Date(); // 현재 시각 포함
  return isBefore(date, now);
};

/**
 * UTC 문자열을 받아 현재 시각과 비교하여 상대 시간 또는 날짜 문자열을 반환하는 함수
 *  - 1분 미만: n초 전
 *  - 1시간 미만: n분 전
 *  - 1일 미만: n시간 전
 *  - 7일 이하: n일 전
 *  - 그 이후: 'yyyy년 M월 d일' 형식으로 표시
 * @param utcTime UTC ISO 문자열 (예: '2025-05-27T08:00:00Z')
 * @returns 상대 시간 또는 'yyyy년 M월 d일'
 */
export const formatRelativeTime = (utcTime: string): string => {
  const date = new Date(utcTime);
  const now = new Date();

  const seconds = Math.abs(differenceInSeconds(now, date));
  const minutes = Math.abs(differenceInMinutes(now, date));
  const hours = Math.abs(differenceInHours(now, date));
  const days = Math.abs(differenceInDays(now, date));

  if (seconds < 60) return `${seconds}초 전`;
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days <= 7) return `${days}일 전`;

  return format(date, 'yyyy년 M월 d일');
};

/**
 * UTC 문자열을 "0000년 0월 0일 오전/오후 0:00" 형식으로 반환하는 합수
 *
 * 예: '2025-06-01T02:10:00Z' → '2025년 6월 1일 오전 11:10'
 *
 * @param utcTime - UTC ISO 문자열 (예: '2025-05-27T08:00:00Z')
 * @returns 한국어 포맷의 날짜 및 시간 문자열
 */
export const formatDateTime = (utcTime: string): string => {
  const date = new Date(utcTime);

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};
