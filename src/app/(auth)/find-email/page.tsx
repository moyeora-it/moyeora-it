'use client';

import Link from 'next/link';
import FindEmailForm from '@/components/organisms/find-email-form';
import { routes } from '@/utils/routes';

export default function Page() {
  return (
    <>
      <p className="font-extrabold text-center text-gray-800">이메일 찾기</p>
      <FindEmailForm />
      <Link href={routes.login} className="text-green-600 flex justify-center">
        로그인으로 돌아가기
      </Link>
    </>
  );
}
