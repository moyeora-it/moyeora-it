/**
 * 화면에 표시할 사용자 닉네임을 반환합니다.
 * 닉네임이 존재하면 해당 닉네임을, 이메일의 @ 앞부분을 반환합니다.
 * @param nickname
 * @param email
 * @returns 화면 표시용 사용자 닉네임
 */
export const getDisplayNickname = (nickname: string | null, email: string) => {
  if(!email) return '이름 없음';
  return nickname || email.split('@')[0];
};

/**
 * 화면에 표시할 프로필 이미지 URL을 반환합니다.
 * 프로필 이미지가 존재하면 해당 이미지를, 없으면 기본 이미지를 반환합니다.
 *
 * @param profileImage - 프로필 이미지 URL
 * @returns 화면 표시용 프로필 이미지 URL
 */
export const getDisplayProfileImage = (profileImage: string | null) => {
  return profileImage || '/images/default-profile.png';
};
