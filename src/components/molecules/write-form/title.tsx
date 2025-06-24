import { WriteFormLabel } from '@/components/atoms/write-form/form-label';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { WriteForm } from '@/types';
import { UseFormReturn } from 'react-hook-form';

type TitleProps = {
  form: UseFormReturn<WriteForm>;
};

export const Title = ({ form }: TitleProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <WriteFormLabel text="제목" />
            <FormControl>
              <Input placeholder="제목과 내용을 입력해주세요!" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
