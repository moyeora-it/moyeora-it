import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { InputText } from '@/components/atoms/input-text';
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

type InputTextFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>; // 제네릭으로 확장 가능
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'search' | 'email' | 'url' | 'tel' | 'number';
};

export const InputTextField = <T extends FieldValues>({
  label,
  type = 'text',
  name,
  form,
  placeholder,
}: InputTextFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold text-gray-900">{label}</FormLabel>
          <FormControl>
            <InputText placeholder={placeholder} type={type} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
