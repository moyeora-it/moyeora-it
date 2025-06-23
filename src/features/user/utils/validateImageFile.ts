/**
 * 이미지 파일 유효성 검사
 *
 * 다음 조건을 만족해야 유효한 이미지로 간주
 * - MIME 타입이 image/로 시작해야 함
 * - 파일 크기가 maxFileSize 이하여야 이미지 파일이 유효함
 *
 * @param file 검사할 이미지 파일
 * @param maxFileSize 최대 파일 크기(기본값: 5MB)
 * @returns 이미지 파일 유효성 검사 결과 객체
 * - isValid: 유효한 이미지 파일인 경우 true, 그렇지 않은 경우 false
 * - errorMessage: 유효하지 않은 경우 오류 메시지
 */
export const validateImageFile = (
  file: File,
  maxFileSize = 1024 * 1024,
): { isValid: boolean; errorMessage?: string } => {
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      errorMessage: '이미지 파일만 업로드할 수 있어요.',
    };
  }

  const fileSize = file.size;
  if (fileSize > maxFileSize) {
    return {
      isValid: false,
      errorMessage: `파일 크기는 ${
        maxFileSize / 1024 / 1024
      }MB를 초과할 수 없어요.`,
    };
  }
  return { isValid: true };
};
