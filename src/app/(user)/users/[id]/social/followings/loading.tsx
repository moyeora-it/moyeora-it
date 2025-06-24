import { Skeleton } from '@/components/ui/skeleton';
import FollowListItemsLoading from '@/features/user/follow/components/follow-list-items-loading';

export default function SocialPageLoading() {
  return (
    <div className="flex flex-col gap-y-6 mt-3">
      <Skeleton className="w-25 h-3" />
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FollowListItemsLoading />
      </ul>
    </div>
  );
}
