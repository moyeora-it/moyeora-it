type CircleNumberProps = { number: number; className?: string };

export const CircleNumber = ({ number, className }: CircleNumberProps) => {
  return (
    <div
      className={`flex w-5 h-5 justify-center items-center text-white bg-primary rounded-full ${className}`}
    >
      <span className="my-auto">{number}</span>
    </div>
  );
};
