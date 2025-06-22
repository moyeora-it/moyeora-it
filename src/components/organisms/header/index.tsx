'use client';

import { Avatar } from '@/components/atoms/avatar';
import { ErrorBoundary } from '@/components/error-boundary';
import { handleError } from '@/components/error-boundary/error-handler';
import { NotificationList } from '@/components/molecules/notification-list';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAuthStore from '@/stores/useAuthStore';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { getDisplayProfileImage, getDisplayNickname } from '@/utils/fallback';
import LogoutButton from '@/components/atoms/logout-button';

type MenuItem = {
  label: string;
  href: string;
};

const menuItems: MenuItem[] = [
  // { label: '프로젝트 찾기', href: '/projects' },
  { label: '찜한 프로젝트', href: '/bookmark' },
];

const Logo = ({ isMobile = false }: { isMobile?: boolean }) => (
  <Link href="/" className="flex items-center">
    <Image
      src="/logos/logo-text.png"
      alt="모여라-IT"
      width={isMobile ? 100 : 120}
      height={isMobile ? 25 : 30}
      className={`w-auto ${isMobile ? 'h-7' : 'h-8'}`}
      priority
    />
  </Link>
);

const MenuLinks = ({ onClick }: { onClick?: () => void }) => {
  const pathname = usePathname();
  return (
    <>
      {menuItems.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className={`text-sm font-medium text-gray-800 hover:text-primary ${pathname === href ? 'text-primary' : ''}`}
          onClick={onClick}
        >
          {label}
        </Link>
      ))}
    </>
  );
};

const MobileMenuLinks = ({ onClick }: { onClick?: () => void }) => {
  const pathname = usePathname();
  return (
    <>
      {menuItems.map(({ label, href }) => (
        <DropdownMenuItem key={href} asChild onClick={onClick}>
          <Link
            href={href}
            className={`${pathname === href ? 'text-primary' : ''}`}
          >
            {label}
          </Link>
        </DropdownMenuItem>
      ))}
    </>
  );
};

const NotificationWithBoundary = () => (
  <ErrorBoundary
    fallback={({ error, resetErrorBoundary }) =>
      handleError({
        error,
        resetErrorBoundary,
        defaultMessage: '알림을 불러오는 중 문제가 발생했습니다',
      })
    }
  >
    <NotificationList />
  </ErrorBoundary>
);

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = Boolean(user);
  const userId = user?.userId ?? 0;
  const profileImage = getDisplayProfileImage(user?.profileImage ?? null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white flex justify-between items-center h-16 md:px-8">
      <nav className="hidden md:flex items-center">
        <Logo />
        <ul className="flex gap-8 ml-8">
          <MenuLinks />
        </ul>
      </nav>

      <div className="hidden md:flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <NotificationWithBoundary />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="cursor-pointer">
                  <Avatar
                    imageSrc={profileImage}
                    fallback={getDisplayNickname(
                      user?.nickname ?? '',
                      user?.email ?? '',
                    )}
                    className="rounded-full w-8 h-8"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/users/${userId}`}>마이 페이지</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link href="/login">
            <Button className="text-sm cursor-pointer font-semibold bg-green-500 text-white">
              로그인 및 회원가입
            </Button>
          </Link>
        )}
      </div>

      <div className="flex md:hidden justify-between items-center h-14 px-4 w-full">
        <Logo isMobile />

        <div className="flex items-center gap-2">
          {isLoggedIn && <NotificationWithBoundary />}

          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button type="button" aria-label="메뉴 열기">
                <Image
                  src="/icons/menu.svg"
                  alt="menu"
                  width={28}
                  height={28}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <MobileMenuLinks onClick={() => setIsMenuOpen(false)} />
              {!isLoggedIn ? (
                <DropdownMenuItem asChild onClick={() => setIsMenuOpen(false)}>
                  <Link href="/login">로그인 및 회원가입</Link>
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href={`/users/${userId}`}>마이 페이지</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogoutButton />
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
