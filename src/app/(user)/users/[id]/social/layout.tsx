import { FollowTabs } from '@/features/user/follow/components/follow-tabs';
import { SearchInput } from '@/components/molecules/search-input/search-input';

export default function SocialPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex justify-between items-center">
        <FollowTabs />
        <SearchInput placeholder="검색" />
      </div>
      {children}
    </>
  );
}
