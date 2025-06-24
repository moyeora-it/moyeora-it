import { Badge } from '../../atoms/badge';
import { Thumbnail } from '../../atoms/thumbnail';

type CardImageProps = {
  imageSrc: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};
export const CardImage = ({
  imageSrc,
  alt,
  width,
  height,
  className,
}: CardImageProps) => {
  return (
    <div className="relative inline-block" style={{ width, height }}>
      <Badge
        text="오늘 마감"
        className="absolute right-0 top-0 p-1 text-sm bg-white text-black rounded-bl-md"
      />
      <Thumbnail
        imageSrc={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    </div>
  );
};
