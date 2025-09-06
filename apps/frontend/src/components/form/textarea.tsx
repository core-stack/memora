import React from 'react';
import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';

type Props = React.ComponentProps<"textarea"> & {
  label?: string
  name: string
  fieldclassname?: string
}

export const FormTextarea = (props: Props) => {
  const form = useFormContext();
  const isLoading = form.formState.isSubmitting;

  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className={props.fieldclassname}>
          {props.label && (<FormLabel>{props.label}</FormLabel>)}
          <FormControl>
            <Textarea disabled={isLoading} {...field} {...props} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};