export enum Position {
  'PM',
  'PL',
  'AA',
  'TA',
  'DA',
  'QA',
  'FE',
  'BE',
  'FS',
}

export enum Skill {
  'Java',
  'JavaScript',
  'HTML_CSS',
  'REACT',
  'Vue',
  'Kotlin',
  'Spring',
}

/** 알림 타입 */
export enum eNotification {
  GROUP_HAS_PARTICIPANT, // 내가 작성한 글에 참여자 생김 -> 신청 수락 페이지, 생성자(모임 생성자)한테 알람, 모임 ID
  CONFIRMED_PARTICIPANT_CANCELED, // 확정 참여자 취소 -> 상세페이지, 생성자한테 알람, 모임 ID
  APPLY_APPROVED, // 내가 신청한 모임 승인-> 상세페이지, 신청자한테 알람
  APPLY_REJECTED, // 내가 신청한 모임 거절 -> x, 신청자한테 알람
  FULL_CAPACITY, // 모임 정원 마감-> 상세페이지, 생성자한테 알람
  FOLLOWER_ADDED, // 팔로워 추가된 경우 알람 -> 유저 상세 페이지, 팔로워된 사람한테 알람
  APPLY_CANCELED, // 내가 신청한 모임 취소 -> x, 신청자한테 알람
  COMMENT_RECEIVED, // 댓글 달린 경우 -> 해당 페이지 댓글로 바로, 상세페이지 id랑, 해당 댓글 id 필요, 생성자한테 알람, 대댓글의 경우(생성자, 원댓글자에게 알람)
  FOLLOWER_CREATE_GROUP, // 팔로워가 모임을 만든 경우 알람 -> 상세페이지, 팔로우한사람한테 알람
  REJECTED_GROUP, // 모임 신청이 거절된 경우, 신청자한테알람
  WITHIN_24_HOUR, // 북마크한 모임이 24시간 남은 경우 알람 -> 상세페이지, 북마크한 사람한테 알람
}

export function getPosition(position: Position): string {
  return Position[position];
}

export function getSkill(skill: Skill): string {
  return Skill[skill];
}
