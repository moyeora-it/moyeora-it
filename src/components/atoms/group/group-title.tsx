type GroupTitleProps = {
  text: string;
  className?: string;
};

export const GroupTitle = ({ text, className }: GroupTitleProps) => {
  return (
    <div
      className={`group-title w-full overflow-hidden whitespace-nowrap text-ellipsis ${className}`}
    >
      {text}
    </div>
  );
};
