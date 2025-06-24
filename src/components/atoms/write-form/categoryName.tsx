import { CircleNumber } from '../circle-icon/circle-number';

type CategoryNameProps = {
  number?: number;
  text: string;
  className?: string;
};

export const CategoryName = ({
  number,
  text,
  className,
}: CategoryNameProps) => {
  return (
    <div className="flex items-center mb-1 py-2 md:py-4 border-b-4 border-gray-100">
      {number && <CircleNumber number={number} />}
      <div className={`ml-2 font-bold ${className}`}>{text}</div>
    </div>
  );
};
