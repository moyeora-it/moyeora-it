import { WriteFormLabel } from '@/components/atoms/write-form/form-label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { WriteForm } from '@/types';
import { formatYearMonthDayWithDot } from '@/utils/dateUtils';
import clsx from 'clsx';
import { CalendarIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

type TitleProps = {
  form: UseFormReturn<WriteForm>;
  isDeadlineCalendarOpen: boolean;
  deadlineSelect: (date: Date) => void;
  openDeadlineCalendar: () => void;
  closeDeadlineCalendar: () => void;
  validDeadline: Date;
};

export const DeadlineCalendar = ({
  form,
  isDeadlineCalendarOpen,
  deadlineSelect,
  openDeadlineCalendar,
  closeDeadlineCalendar,
  validDeadline,
}: TitleProps) => {
  const hasError = !!form.formState.errors.deadline;
  /** calendar에서 날짜 선택 후 calendar가 닫히게 하기 위한 함수 */
  const deadlineSelectHandler = (
    date: Date | undefined,
    onChange: (date: Date | undefined) => void,
  ) => {
    if (!date) return;

    deadlineSelect(date);
    onChange(date);
    closeDeadlineCalendar();
  };

  return (
    <>
      <FormField
        control={form.control}
        name="deadline"
        render={({ field, fieldState }) => (
          <FormItem>
            <WriteFormLabel
              text="모집 마감일"
              info="오늘 이후의 날짜부터 선택 가능합니다"
            />
            <Popover
              open={isDeadlineCalendarOpen}
              onOpenChange={
                isDeadlineCalendarOpen
                  ? closeDeadlineCalendar
                  : openDeadlineCalendar
              }
            >
              <div className="flex items-center gap-5 relative w-[fit-content]">
                <div>
                  {field.value ? (
                    formatYearMonthDayWithDot(field.value)
                  ) : (
                    <>
                      <div className="text-gray-400">
                        {formatYearMonthDayWithDot(validDeadline)}
                      </div>
                    </>
                  )}
                </div>
                <FormControl className="inline-block">
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
                      deadlineSelectHandler(e, field.onChange);
                    }}
                    disabled={{ before: validDeadline }}
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
