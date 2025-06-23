import { WriteFormLabel } from '@/components/atoms/write-form/form-label';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { WriteForm } from '@/types';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

type TitleProps = {
  form: UseFormReturn<WriteForm>;
};

export const MaxParticipants = ({ form }: TitleProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const inputBlurHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (value === 0) {
      // 입력값이 없거나 0이면 2로 세팅
      form.setValue('maxParticipants', 2);
      return;
    }

    if (value < 2 || value > 30) {
      const settedValue = Math.max(2, Math.min(30, value));
      form.setValue('maxParticipants', settedValue);

      setIsTooltipOpen(true);
    }
  };

  /**
   * 정원 보정 후 툴팁이 3초뒤에 사라지게 하기
   */

  useEffect(() => {
    if (isTooltipOpen) {
      const timer = setTimeout(() => {
        setIsTooltipOpen(false);
      }, 3000); // 3초

      return () => clearTimeout(timer);
    }
  }, [isTooltipOpen]);

  return (
    <>
      <FormField
        control={form.control}
        name="maxParticipants"
        render={({ field }) => (
          <FormItem>
            <WriteFormLabel
              htmlFor="maxParticipants"
              text="정원"
              info="최소 2명 ~ 최대 30명까지 가능합니다"
              isTooltipOpen={isTooltipOpen}
            />
            <FormControl>
              <Input
                id="maxParticipants"
                min={2}
                max={30}
                placeholder="정원을 입력해주세요"
                {...field}
                type="number"
                onBlur={(e) => {
                  inputBlurHandler(e);
                  field.onBlur();
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
