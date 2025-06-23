'use client';

import { Skeleton } from '@/components/ui/skeleton';

export const MemberListLoading = () => {
  return (
    <ul className="flex flex-col gap-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <li key={index} className="flex gap-x-6 pb-5">
          <Skeleton className="size-14 rounded-full" />
          <div className="flex flex-col gap-y-1">
            <Skeleton className="w-20 h-6" />
            <Skeleton className="w-40 h-4" />
          </div>
        </li>
      ))}
    </ul>
  );
};
