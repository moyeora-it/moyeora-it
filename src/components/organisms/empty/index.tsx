import Image from 'next/image';
import Link from 'next/link';

type EmptyProps = {
  mainText: string;
  subText?: string;
  targetUrl?: string;
  className?: string;
};

export const Empty = ({
  mainText,
  subText,
  targetUrl,
  className,
}: EmptyProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 my-2 ${className}`}
    >
      <Image
        src="/logos/my-img.png"
        alt="empty groups"
        width={120}
        height={120}
        className="grayscale"
      />
      <p className="mt-2 text-gray-500 text-lg">{mainText}</p>
      {subText && <p className="text-gray-400">{subText}</p>}
      {targetUrl && (
        <p className="text-gray-400">
          자세한 내용은 <Link href={targetUrl}>이곳</Link>에서 확인해보세요
        </p>
      )}
    </div>
  );
};
