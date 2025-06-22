'use client';

export const AddRereplyButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="flex justify-center border-t py-1">
      <button className="cursor-pointer" onClick={onClick}>
        대댓글 달기
      </button>
    </div>
  );
};
