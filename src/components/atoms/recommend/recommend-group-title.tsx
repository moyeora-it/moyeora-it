type RecommendGroupTitleProps = {
  text: string;
  className?: string;
};

export const RecommendGroupTitle = ({
  text,
  className,
}: RecommendGroupTitleProps) => {
  return (
    <div
      className={`group-title w-full h-[40px] lg:h-[60px] text-sm lg:text-lg line-clamp-2 ${className}`}
    >
      {text}
    </div>
  );
};
