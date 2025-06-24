import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

type AvatarProps = {
  imageSrc: string;
  fallback: string;
  className?: string;
  onClick?: () => void;
};

/**
 * 아바타 컴포넌트
 * @param imageSrc 이미지 주소(문자열)
 * @param fallback 아바타 폴백 문자열(문자열)
 * @param className 클래스명(문자열)
 * @param onClick 클릭 이벤트(함수)
 * @returns 아바타 컴포넌트
 */
export const Avatar = ({
  imageSrc,
  fallback,
  className,
  onClick,
}: AvatarProps) => {
  return (
    <ShadcnAvatar className={className} onClick={onClick}>
      <AvatarImage src={imageSrc} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </ShadcnAvatar>
  );
};
