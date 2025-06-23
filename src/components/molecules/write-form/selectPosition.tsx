import { WriteFormLabel } from '@/components/atoms/write-form/form-label';
import { PositionBadge } from '@/components/molecules/position-badge';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { DEFAULT_POSITION_NAMES, PositionName, WriteForm } from '@/types';
import clsx from 'clsx';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

type SelectPositionProps = {
  form: UseFormReturn<WriteForm>;
};

export const SelectPosition = ({ form }: SelectPositionProps) => {
  const [selectedPositions, setSelectedPositions] = useState<PositionName[]>(
    [],
  );
  const hasError = !!form.formState.errors.position;

  const positionClickHandler = (position: PositionName) => {
    const isSelected = selectedPositions.find(
      (selectedSkill) => selectedSkill === position,
    );

    // toggle. 지금 선택한 스킬이 이미 선택되어 있었다면 제외돼야 함
    if (isSelected) {
      const nextSelectedPositions = selectedPositions.filter(
        (selectedSkill) => selectedSkill !== position,
      );

      setSelectedPositions(nextSelectedPositions);
      form.setValue('position', nextSelectedPositions);
    } else {
      const nextSelectedPositions = [...selectedPositions, position];

      setSelectedPositions(nextSelectedPositions);
      form.setValue('position', nextSelectedPositions);
    }
  };
  return (
    <>
      <FormField
        control={form.control}
        name="position"
        render={({ field, fieldState }) => (
          <FormItem>
            <WriteFormLabel text="모집 포지션" />
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
                {DEFAULT_POSITION_NAMES.map((position, i) => (
                  <li
                    key={i}
                    className={
                      selectedPositions.includes(position)
                        ? '[&_.position-badge]:border-3 [&_.position-badge]:border-green-500'
                        : ''
                    }
                  >
                    <PositionBadge
                      name={position}
                      positionClickHandler={positionClickHandler}
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
