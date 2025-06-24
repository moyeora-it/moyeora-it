import { WriteFormLabel } from '@/components/atoms/write-form/form-label';
import { Button } from '@/components/ui//button';
import { Calendar } from '@/components/ui//calendar';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui//form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui//popover';
import { WriteForm } from '@/types';
import { formatYearMonthDayWithDot } from '@/utils/dateUtils';
import clsx from 'clsx';
import { CalendarIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

type TitleProps = {
  form: UseFormReturn<WriteForm>;
  isStartDateCalendarOpen: boolean;
  openStartDateCalendar: () => void;
  closeStartDateCalendar: () => void;
  validStartDate: Date;
};

export const StartDateCalendar = ({
  form,
  isStartDateCalendarOpen,
  openStartDateCalendar,
  closeStartDateCalendar,
  validStartDate,
}: TitleProps) => {
  const hasError = !!form.formState.errors.startDate;

  /** calendar에서 날짜 선택 후 calendar가 닫히게 하기 위한 함수 */
  const startDateSelect = (
    date: Date | undefined,
    onChange: (date: Date | undefined) => void,
  ) => {
    if (!date) return;

    onChange(date);
    closeStartDateCalendar();
  };

  return (
    <>
      <FormField
        control={form.control}
        name="startDate"
        render={({ field, fieldState }) => (
          <FormItem>
            <WriteFormLabel
              text="모임 시작일"
              info="모집 마감일의 다음 날부터 선택 가능합니다"
            />
            <Popover
              open={isStartDateCalendarOpen}
              onOpenChange={
                isStartDateCalendarOpen
                  ? closeStartDateCalendar
                  : openStartDateCalendar
              }
            >
              <div className="flex items-center gap-5 relative w-[fit-content]">
                <div>
                  {field.value ? (
                    formatYearMonthDayWithDot(field.value)
                  ) : (
                    <>
                      <div className="text-gray-500">
                        {formatYearMonthDayWithDot(validStartDate)}
                      </div>
                    </>
                  )}
                </div>
                <FormControl>
                  <input
                    {...field}
                    tabIndex={-1}
                    className={clsx(
                      'absolute top-[-4px] right-[-4px] bottom-[-4px] left-[-4px] text-transparent caret-transparent z-[-1] rounded-md',
                      hasError
                        ? 'outline-1 outline-destructive focus-visible:ring-red-500/20 focus-visible:ring-[3px]'
                        : 'border-none outline-none',
                    )}
                    aria-hidden="true"
                    value={field.value ? field.value.toISOString() : ''}
                  />
                </FormControl>
                <PopoverTrigger className="cursor-pointer" asChild>
                  <Button type="button" className="w-[fit-content]">
                    <CalendarIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(e) => {
                      startDateSelect(e, field.onChange);
                    }}
                    disabled={{ before: validStartDate }}
                  />
                </PopoverContent>
              </div>
            </Popover>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />
    </>
  );
};
