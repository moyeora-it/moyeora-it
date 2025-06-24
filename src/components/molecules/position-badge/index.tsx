'use client';

import { Badge } from '@/components/atoms/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Position } from '@/types/enums';

/**  숫자 enum Skill의 키 이름으로 이미지 주소와 매칭 시키기 */
export const allPositionlKeys = Object.keys(Position).filter((key) =>
  isNaN(Number(key)),
);

const positionWithDescription: Record<
  (typeof allPositionlKeys)[number],
  string
> = {
  PM: '프로젝트 매니저',
  PL: '파트 리더',
  AA: '개발 설계 담당자',
  TA: '기술 담당자',
  DA: '데이터 분석가',
  QA: '품질 보증 담당자',
  FE: '프론트엔드 개발자',
  BE: '백엔드 개발자',
  FS: '풀스택 개발자',
};

const positionLogoMap: { [key: string]: string } = {};

allPositionlKeys.forEach((position) => {
  positionLogoMap[position] = `/logos/${position.replace(
    /[^a-zA-Z0-9]/g,
    '',
  )}.png`;
});

type PositionBadgeProps = {
  name: string;
  positionClickHandler?: (name: string) => void;
};

export const PositionBadge = ({
  name,
  positionClickHandler,
}: PositionBadgeProps) => {
  return (
    <Tooltip>
      <div className="position-badge flex flex-row cursor-pointer">
        <TooltipTrigger
          type="button"
          onClick={() => positionClickHandler?.(name)}
        >
          <Badge
            text={name}
            className="text-sm font-medium bg-gray-100 text-gray-600 px-1"
          />
        </TooltipTrigger>
      </div>
      <TooltipContent>
        <p>{positionWithDescription[name]}</p>
      </TooltipContent>
    </Tooltip>
  );
};
