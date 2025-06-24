import { GroupFilter } from '@/components/molecules/group-filter/group-filter';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GroupFilter />
      {children}
    </>
  );
}
