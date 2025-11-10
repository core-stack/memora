import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Help } from '../ui/help';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Props = {
  label?: string;
  name: string;
  fieldclassname?: string;
  help?: string;
  required?: boolean;
  disabled?: boolean;
  data: { value: string; label: string }[];
  placeholder?: string;
  defaultValue?: string;
};

export const FormSelect = (props: Props) => {
  const form = useFormContext();
  const isLoading = form.formState.isSubmitting;

  if (props.help && !props.label) {
    throw new Error("help prop requires label prop");
  }

  const log = (...args: any) => {
    console.log(...args);
    return true;
  }

  return (
    <FormField
      control={form.control}
      name={props.name}
      defaultValue={props.defaultValue}
      disabled={props.disabled || isLoading}
      render={({ field }) => (
        <FormItem className={props.fieldclassname}>
          {
            !log("field", field) &&
            props.label && (
              <FormLabel className='flex gap-0.5'>
                { props.label }
                { props.required && <span className="text-destructive">*</span> }
                { props.help && <Help text={props.help} /> }
              </FormLabel>
            )
          }
          <FormControl>
            <Select
              disabled={isLoading || props.disabled}
              value={field.value}
              name={props.name}
              onValueChange={(v) => field.onChange(v)}
              defaultValue={props.defaultValue}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {
                  props.data.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
