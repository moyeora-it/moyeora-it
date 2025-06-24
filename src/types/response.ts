import { User } from '.';


// ISSUE: 백엔드 응답 타입 수정필요
export type UserInfoResponse = {
  status: { code: number; message: string; success: boolean };
  items: {
    averageRating: number;
    items: User;
  };
  userId?: string; // 임시 필드, 백엔드 응답 타입 수정 후 제거
};

export type InfiniteResponse<T> = {
  status: {
    code: number;
    message: string;
    success: boolean;
  };
  data: T[];
  hasNext: boolean;
  cursor: number;
};

export type CommonResponse<T> = {
  status: {
    code: number;
    message: string;
    success: boolean;
  };
  data: T;
};
