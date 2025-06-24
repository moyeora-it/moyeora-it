import { WriteFormLabel } from '@/components/atoms/write-form/form-label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { WriteForm } from '@/types';
import { UseFormReturn } from 'react-hook-form';

type TitleProps = {
  form: UseFormReturn<WriteForm>;
};

export const AutoAllow = ({ form }: TitleProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="autoAllow"
        render={(field) => (
          <FormItem className="flex items-center">
            <FormControl>
              <Checkbox
                id="autoAllow"
                onClick={() => {
                  /** 클릭 시 field의 값을 받아서 토글 */
                  form.setValue('autoAllow', !field.field.value);
                }}
              />
            </FormControl>
            <WriteFormLabel htmlFor="autoAllow" text="참가 자동 수락" />
          </FormItem>
        )}
      />
    </>
  );
};
