import { Header } from '@/components/organisms/header';
import { AutoLoginManager } from '@/features/auth/components/AutoLoginManager';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { SocketProvider } from '@/providers/WSProvider';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: '모여라-IT',
  description: '개발자들의 스터디, 사이트 프로젝트 모집 플랫폼',
  icons: {
    icon: '/logos/logo-img.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <ReactQueryProvider>
          {/* 소켓 설정 전에 로그인 판단해야하므로 로그인 위로 올림 */}
          <AutoLoginManager />
          <SocketProvider>
            <Header />
            {children}
          </SocketProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
