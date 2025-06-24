import Link from 'next/link';
import LoginForm from '@/components/organisms/login-form';
import { headers } from 'next/headers';
import LoginTriggerManager from '@/features/auth/components/LoginTriggerManager';
import { routes } from '@/utils/routes';

export default async function Page() {
  const headerList = await headers();
  // next-url: next에서 제공해주는 이전 path, Link나 router.push, redirect로 이동할 때 자등으로 저장됨
  const nextUrl = headerList.get('next-url') || '/';

  return (
    <>
      <p className="font-extrabold text-center text-gray-800">로그인</p>
      <LoginForm />

      <div className="flex flex-col items-center gap-1">
        <div className="flex gap-1">
          <p>모여라it이 처음이신가요?</p>
          <Link href={routes.register} className="text-green-600">
            회원가입
          </Link>
        </div>
        <Link href={routes.findEmail} className="text-green-600">
          이메일 찾기
        </Link>
        <Link href={routes.findPassword} className="text-green-600">
          비밀번호 찾기
        </Link>
      </div>

      <LoginTriggerManager prevPathname={nextUrl} />
    </>
  );
}
