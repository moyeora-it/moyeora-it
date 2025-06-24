type DeadlineProps = {
  text: string;
  className?: string;
};

export const Deadline = ({ text, className }: DeadlineProps) => {
  return (
    <div className="mt-4 text-gray-500 font-semibold text-sm line">
      <span
        className={`relative before:absolute before:top-[1px] before:bottom-[1px] before:left-[100%] before:content-[''] before:w-[2px] before:bg-gray-500 before:mx-[2px]`}
      >
        마감일
      </span>
      <span className={`ml-2 ${className}`}>{text}</span>
    </div>
  );
};
