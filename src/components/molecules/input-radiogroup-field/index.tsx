import {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FormRadioGroupFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  options: string[];
}

export const FormRadioGroupField = <T extends FieldValues>({
  form,
  name,
  label,
  options,
}: FormRadioGroupFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({
        field,
      }: {
        field: ControllerRenderProps<T, FieldPath<T>>;
      }) => (
        <FormItem className="space-y-3">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex gap-4 flex-wrap"
            >
              {options.map((option) => (
                <FormItem
                  key={option}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={option} className="hidden" />
                  </FormControl>
                  <FormLabel
                    className={`font-normal p-1 rounded text-gray-600 cursor-pointer bg-gray-300 ${
                      form.watch(name) === option && 'bg-red-300'
                    }`}
                  >
                    {option}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
