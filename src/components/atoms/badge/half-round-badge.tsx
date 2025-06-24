type BadgeProps = {
  text: string;
  className?: string;
};
export const HalfRoundBadge = ({ text, className }: BadgeProps) => {
  return (
    <span
      className={`flex px-2 py-[2px] md:px-2 text-[10px] font-semibold items-center rounded-xl ${className}`}
    >
      {text}
    </span>
  );
};
