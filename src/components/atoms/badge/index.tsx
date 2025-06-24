type BadgeProps = {
  text: string;
  className?: string;
};
export const Badge = ({ text, className }: BadgeProps) => {
  return (
    <span className={`flex items-center p-1 rounded-sm ${className}`}>
      {text}
    </span>
  );
};
