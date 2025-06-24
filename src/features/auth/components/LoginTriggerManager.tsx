'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type TriggerManagerProps = {
  prevPathname: string;
};

const LoginTriggerManager = ({ prevPathname }: TriggerManagerProps) => {
  const router = useRouter();
  useEffect(() => {
    // 뒤로가기 버튼같은 경로로 로그인 페이지 접근시 layout이 캐쉬된걸 불러와서 쿠키 다시 확인용
    router.refresh();

    // 인증 페이지들 사이에서 이동하는 경우 저장하지 않도록 처리!!!!!!!!!!!!!!!
    if (
      prevPathname === '/login' ||
      prevPathname === '/register' ||
      prevPathname === '/find-email' ||
      prevPathname === '/find-password'
    ) {
      return;
    }

    localStorage.setItem('login-trigger-path', prevPathname);
    // eslint-disable-next-line
  }, []);

  return null;
};

export default LoginTriggerManager;
