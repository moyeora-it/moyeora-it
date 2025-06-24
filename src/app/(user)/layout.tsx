// import checkAuthCookie from '@/features/auth/utils/checkAuthCookie';
// import { redirect } from 'next/navigation';
import { UserPageTabs } from '@/features/user/components/user-page-tabs';
import { UserProfile } from '@/features/user/components/user-profile';

export default async function UserPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ISSUE1: 쿠키가 있다고 인증 처리를 하면 안됨 -> 쿠키는 유저가 임의로 조작가능, api 통신필요
  // ISSUE2: 근데 로그인 안햇다고 해당 페이지 안보여주나요? 일단 가드처리해뒀어요

  // const isValid = await checkAuthCookie();

  // if (!isValid) {
  //   redirect('/login');
  // }

  // if (!hasToken) {
  //   redirect('/login');
  // }

  return (
    <div className=" bg-gray-50">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-y-5 pt-6 px-4 md:px-10 lg:px-25 min-h-[calc(100dvh-4rem)]">
        <h1 className="font-semibold text-lg">유저 페이지</h1>
        <div className="flex flex-col gap-y-5 bg-white rounded-t-2xl rounded-b-2xl mb-4 flex-1">
          <UserProfile />
          <div className="bg-white flex flex-col gap-y-2.5 rounded-b-2xl flex-1">
            <UserPageTabs />
            <main className="mx-4 flex-1 flex flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
