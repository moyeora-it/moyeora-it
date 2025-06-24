'use client';

import { Skeleton } from '@/components/ui/skeleton';

type FollowListItemsLoadingProps = {
  itemCount?: number;
};

export default function FollowListItemsLoading({
  itemCount = 6,
}: FollowListItemsLoadingProps) {
  return (
    <>
      {Array.from({ length: itemCount }).map((_, i) => (
        <li key={i} className="pb-6">
          <div className="flex justify-between">
            <div className="flex gap-x-6 items-start">
              <Skeleton className="size-[4.75rem] rounded-full" />
              <div className="flex flex-col justify-start gap-y-2">
                <Skeleton className="w-42 h-4" />
                <Skeleton className="w-28 h-3" />
              </div>
            </div>
          </div>
        </li>
      ))}
    </>
  );
}
