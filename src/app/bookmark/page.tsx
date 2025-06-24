import { Metadata } from 'next';
import { BookmarkPageClient } from './BookmarkPageClient';

export const metadata: Metadata = {
  title: '찜한 모임 | 모여라-IT',
  description: '찜한 모임을 확인할 수 있습니다.',
  openGraph: {
    title: '찜한 모임 | 모여라-IT',
    description: '찜한 모임을 확인할 수 있습니다.',
    images: [{ url: '/logos/logo-img.svg' }],
  },
};

export default function BookmarkPage() {
  return <BookmarkPageClient />;
}
