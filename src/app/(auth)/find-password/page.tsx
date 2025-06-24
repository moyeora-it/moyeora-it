'use client';

import Link from 'next/link';
import FindPassword from '@/components/organisms/find-password-form';
import { routes } from '@/utils/routes';

export default function Page() {
  return (
    <>
      <p className="font-extrabold text-center text-gray-800">비밀번호 찾기</p>
      <FindPassword />
      <Link href={routes.login} className="text-green-600 flex justify-center">
        로그인으로 돌아가기
      </Link>
    </>
  );
}
