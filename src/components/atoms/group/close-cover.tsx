import Link from 'next/link';

type CloseCoverProps = {
  itemId: number;
};

export const CloseCover = ({ itemId }: CloseCoverProps) => {
  return (
    <Link href={`/groups/${itemId}`}>
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
        <p className="text-white text-lg font-medium ">
          ⌛️ 모집이 종료되었습니다.
        </p>
      </div>
    </Link>
  );
};
