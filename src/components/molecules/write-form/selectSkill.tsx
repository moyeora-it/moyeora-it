import { WriteFormLabel } from '@/components/atoms/write-form/form-label';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { DEFAULT_SKILL_NAMES, WriteForm } from '@/types';
import { SkillName } from '@/types/index';
import clsx from 'clsx';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SkillBadge } from '../skill-badge';

type SelectSkillProps = {
  form: UseFormReturn<WriteForm>;
};

export const SelectSkill = ({ form }: SelectSkillProps) => {
  const [selectedSkills, setSelectedSkills] = useState<SkillName[]>([]);
  const hasError = !!form.formState.errors.skills;

  const skillClickHandler = (skill: SkillName) => {
    const isSelected = selectedSkills.find(
      (selectedSkill) => selectedSkill === skill,
    );

    // toggle. 지금 선택한 스킬이 이미 선택되어 있었다면 제외돼야 함
    if (isSelected) {
      const nextSelectedSkills = selectedSkills.filter(
        (selectedSkill) => selectedSkill !== skill,
      );

      setSelectedSkills(nextSelectedSkills);
      form.setValue('skills', nextSelectedSkills);
    } else {
      const nextSelectedSkills = [...selectedSkills, skill];

      setSelectedSkills(nextSelectedSkills);
      form.setValue('skills', nextSelectedSkills);
    }
  };
  return (
    <>
      <FormField
        control={form.control}
        name="skills"
        render={({ field, fieldState }) => (
          <FormItem>
            <WriteFormLabel text="기술 스택" />
            <div className="relative w-[fit-content]">
              <FormControl>
                <input
                  {...field}
                  tabIndex={-1}
                  className={clsx(
                    'absolute top-[-4px] right-[-4px] bottom-[-4px] left-[-4px] text-transparent caret-transparent z-[-1]  rounded-md',
                    hasError
                      ? 'outline-1 outline-destructive focus-visible:ring-red-500/20 focus-visible:ring-[3px]'
                      : 'border-none outline-none',
                  )}
                  aria-hidden="true"
                  value={field.value ?? ''}
                />
              </FormControl>
              <ul className="flex gap-2">
                {DEFAULT_SKILL_NAMES.map((skill, i) => (
                  <li
                    key={i}
                    className={
                      selectedSkills.includes(skill)
                        ? '[&_.skill-badge]:border-3 [&_.skill-badge]:border-green-500'
                        : ''
                    }
                  >
                    <SkillBadge
                      name={skill}
                      skillClickHandler={skillClickHandler}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />
    </>
  );
};
