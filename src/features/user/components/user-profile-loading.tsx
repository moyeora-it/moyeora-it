import { Skeleton } from '@/components/ui/skeleton';

export const UserProfileLoading = () => {
  return (
    <div className="flex absolute top-4 left-6 right-6 gap-x-3">
      <div className="flex flex-col items-center">
        <Skeleton className="size-[4.75rem] rounded-full" />
      </div>
      <div className="flex flex-col gap-y-9 mt-4 flex-1 min-w-0">
        <div className="flex items-center justify-between md:gap-x-5 md:justify-start">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-7 w-23" />
        </div>
        <div className='flex flex-col gap-y-1'>
          <Skeleton className='h-4 w-40'/>
          <Skeleton className='h-4 w-35'/>
        </div>
      </div>
    </div>
  );
};
