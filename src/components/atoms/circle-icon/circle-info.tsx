type CircleInfoProps = { className?: string };

export const CircleInfo = ({ className }: CircleInfoProps) => {
  return (
    <div
      className={`flex w-4 h-4 justify-center items-center text-xs text-white bg-gray-500 rounded-full ${className}`}
    >
      <span className="my-auto">i</span>
    </div>
  );
};
