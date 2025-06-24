'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SkillName } from '@/types';
import { Skill } from '@/types/enums';
import Image from 'next/image';

/**  숫자 enum Skill의 키 이름으로 이미지 주소와 매칭 시키기 */
export const allSkillKeys = Object.keys(Skill).filter((key) =>
  isNaN(Number(key)),
);

const skillLogoMap: { [key: string]: string } = {};

allSkillKeys.forEach((skill) => {
  skillLogoMap[skill] = `/logos/${skill.replace(/[^a-zA-Z0-9]/g, '')}.png`;
});

type SkillBadgeProps = {
  name: SkillName;
  isDefault?: boolean;
  skillClickHandler?: (name: SkillName) => void;
};

export const SkillBadge = ({
  name,
  isDefault = true,
  skillClickHandler,
}: SkillBadgeProps) => {
  return (
    <Tooltip>
      <div className="skill-badge flex w-full h-full flex-row border p-1 items-center justify-center rounded-full cursor-pointer">
        <TooltipTrigger type="button" onClick={() => skillClickHandler?.(name)}>
          {isDefault && (
            <Image src={skillLogoMap[name]} alt="logo" width={20} height={20} />
          )}
        </TooltipTrigger>
      </div>
      <TooltipContent>
        <p>{name}</p>
      </TooltipContent>
    </Tooltip>
  );
};
