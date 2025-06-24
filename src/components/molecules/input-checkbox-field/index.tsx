// components/molecules/FormCheckboxGroupField.tsx

import {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

interface FormCheckboxGroupFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  options: string[];
}

export const FormCheckboxGroupField = <T extends FieldValues>({
  form,
  name,
  label,
  description,
  options,
}: FormCheckboxGroupFieldProps<T>) => {
  return (
    <FormItem>
      <div className="mb-4">
        <FormLabel className="text-base">{label}</FormLabel>
        {description && <FormDescription>{description}</FormDescription>}
      </div>
      <div className="flex gap-4 flex-wrap">
        {options.map((option) => (
          <FormField
            key={option}
            control={form.control}
            name={name}
            render={({
              field,
            }: {
              field: ControllerRenderProps<T, FieldPath<T>>;
            }) => {
              return (
                <FormItem className="flex items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      className="hidden"
                      checked={field.value?.includes(option)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, option])
                          : field.onChange(
                              field.value?.filter((v: string) => v !== option),
                            );
                      }}
                    />
                  </FormControl>
                  <FormLabel
                    className={`font-normal p-1 rounded text-gray-600 cursor-pointer bg-gray-300 ${
                      form.watch(name).includes(option) && 'bg-red-300'
                    }`}
                  >
                    {option}
                  </FormLabel>
                </FormItem>
              );
            }}
          />
        ))}
      </div>
      <FormMessage />
    </FormItem>
  );
};
