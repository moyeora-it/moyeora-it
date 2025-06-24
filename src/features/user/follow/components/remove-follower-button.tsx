import { useRemoveFollower } from '@/features/user/follow/hooks/useRemoveFollower';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type RemoveFollowerButtonProps = {
  userId: string;
};

export const RemoveFollowerButton = ({ userId }: RemoveFollowerButtonProps) => {
  const { mutate: removeFollower, isPending } = useRemoveFollower({ userId });

  const removeFollowerButtonClickHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = (e) => {
    e.preventDefault();
    removeFollower();
  };

  return (
    <Button
      onClick={removeFollowerButtonClickHandler}
      disabled={isPending}
      className={`shadow-none hover:bg-white! cursor-pointer border-none text-red-600 [&>svg]:text-red-600! bg-white h-[28px] text-sm font-semibold rounded-lg py-1 px-3 gap-x-[6px]`}
    >
      <X className='size-4' />
      삭제
    </Button>
  );
};
