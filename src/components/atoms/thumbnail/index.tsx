import Image from 'next/image';

type ThumbnailProps = {
  imageSrc: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};
export const Thumbnail = ({
  imageSrc,
  alt,
  width,
  height,
  className,
}: ThumbnailProps) => {
  return (
    //TODO:contain으로 할지 cover로 할지 결정해야함 -> 프로젝트 만들 때 최적사이즈 제공하면 좋음
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={`${className} object-cover w-full h-full`}
    />
  );
};
