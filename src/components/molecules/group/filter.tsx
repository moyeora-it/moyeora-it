'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import {
  DEFAULT_POSITION_NAMES,
  DEFAULT_SKILL_NAMES,
  PositionName,
  SkillName,
} from '@/types';
import { PopoverContent } from '@radix-ui/react-popover';
import { useSearchParams } from 'next/navigation';

type FilterProps = {
  updateQueryParams: (queries: Record<string, string>) => void;
};

export const Filter = ({ updateQueryParams }: FilterProps) => {
  const searchParams = useSearchParams();
  const selectedSkills = searchParams.get('skill')?.split(',') ?? [];
  const selectedPositions = searchParams.get('position')?.split(',') ?? [];
  const isSelectedSkills = selectedSkills?.length > 0;
  const isSelectedPosition = selectedPositions?.length > 0;

  const skillSelectHandler = (skill: SkillName) => {
    if (skill === '') {
      // 전체 선택한 경우 삭제
      updateQueryParams({ skill: '' });
      return;
    }

    if (selectedSkills.length === 0) {
      // 아직 선택한 기술이 하나도 없다면 현재 선택한 기술만 추가
      updateQueryParams({ skill: skill });
      return;
    }
    if (!selectedSkills.includes(skill)) {
      // 기존에 선택된 기술에 현재 선택한 기술이 없다면 추가
      updateQueryParams({ skill: [...selectedSkills, skill].join(',') });
      return;
    }

    // 위에 해당하지 않는다면 이미 선택되어있는 기술을 또 선택한 것이므로 삭제돼야 함
    const nextSkill = selectedSkills.filter(
      (selectedSkill) => selectedSkill !== skill,
    );

    updateQueryParams({
      skill: nextSkill.join(','),
    });
  };

  // skillSlectHandler와 동일한 로직
  const positionSelectHandler = (position: PositionName) => {
    if (position === '') {
      updateQueryParams({ position: '' });
      return;
    }

    if (selectedPositions.length === 0) {
      updateQueryParams({ position: position });
      return;
    }
    if (!selectedPositions.includes(position)) {
      updateQueryParams({
        position: [...selectedPositions, position].join(','),
      });
      return;
    }

    const nextSelectedPositions = selectedPositions.filter(
      (selectedPosition) => selectedPosition !== position,
    );

    updateQueryParams({
      position: nextSelectedPositions.join(','),
    });
  };

  return (
    <div className="flex gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={isSelectedSkills ? 'default' : 'outline'}
            className="cursor-pointer"
          >
            기술 스택
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex gap-1 mt-1 p-3 bg-white ring-1 ring-gray-200 rounded-md z-10">
          <Button
            variant="outline"
            onClick={() => skillSelectHandler('')}
            className={`cursor-pointer
                ${selectedSkills.length === 0 ? 'ring-2 ring-green-400' : ''} 
              `}
          >
            전체
          </Button>
          {DEFAULT_SKILL_NAMES.map((skill) => (
            <Button
              variant="outline"
              key={skill}
              onClick={() => skillSelectHandler(skill)}
              className={`cursor-pointer
                ${
                  selectedSkills?.includes(skill) ? 'ring-2 ring-green-400' : ''
                } 
              `}
            >
              {skill}
            </Button>
          ))}
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={isSelectedPosition ? 'default' : 'outline'}
            className="cursor-pointer"
          >
            포지션
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex gap-1 mt-2 p-2  bg-white ring-1 ring-gray-200 rounded-md z-10">
          <Button
            variant="outline"
            onClick={() => positionSelectHandler('')}
            className={`cursor-pointer
                ${
                  selectedPositions.length === 0 ? 'ring-2 ring-green-400' : ''
                } 
              `}
          >
            전체
          </Button>
          {DEFAULT_POSITION_NAMES.map((position) => (
            <Button
              variant="outline"
              key={position}
              onClick={() => positionSelectHandler(position)}
              className={`cursor-pointer
                ${
                  selectedPositions?.includes(position)
                    ? 'ring-2 ring-green-400'
                    : ''
                } 
              `}
            >
              {position}
            </Button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};
