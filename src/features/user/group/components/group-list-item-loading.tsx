import { Skeleton } from '@/components/ui/skeleton';

type GroupListItemLoadingProps = {
  itemCount?: number;
};

export const GroupListItemLoading = ({
  itemCount = 4,
}: GroupListItemLoadingProps) => {
  return (
    <>
      {Array.from({ length: itemCount }).map((_, index) => (
        <li key={index} className="h-60 p-4 border border-gray-200 rounded-2xl">
          <div className="flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <Skeleton className="w-40 h-5.5" />
              <Skeleton className="w-17 h-6 rounded-lg" />
            </div>
            <div className="flex flex-col gap-y-2.5">
              <Skeleton className="w-50 h-3.5" />
              <ul className="flex items-center gap-x-2">
                {[1, 2, 3].map((i) => (
                  <li key={i}>
                    <Skeleton className="size-[30px] rounded-full" />
                  </li>
                ))}
              </ul>
              <ul className="flex items-center gap-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i}>
                    <Skeleton className="size-7 rounded-sm" />
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-x-3 pt-3">
                <div className="flex items-center gap-x-1.5">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="size-8 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </>
  );
};
