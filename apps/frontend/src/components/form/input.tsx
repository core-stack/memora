import React from 'react';
import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

type Props = React.ComponentProps<"input"> & {
  label?: string;
  name: string;
  fieldclassname?: string;
  split?: boolean | { separator: string; type?: "string" | "number" };
};

export const FormInput = ({ split, ...props }: Props = { split: false } as Props) => {
  const form = useFormContext();
  const isLoading = form.formState.isSubmitting;
  
  let splitOptions: { separator: string; type?: "string" | "number" } | undefined;
  if (typeof split === "boolean") {
    if (split) splitOptions = { separator: ",", type: "string" }
  } else if (typeof split === "object") {
    splitOptions = { type: split?.type ?? "string", separator: split?.separator ?? "," };
  }

  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className={props.fieldclassname}>
          {props.label && <FormLabel>{props.label}</FormLabel>}
          <FormControl>
            <Input
              disabled={isLoading}
              {...props}
              value={
                splitOptions && Array.isArray(field.value)
                  ? field.value.join(splitOptions.separator)
                  : field.value ?? ""
              }
              onChange={(e) => {
                const val = e.target.value;
                
                if (splitOptions) {
                  const arr = val
                    .split(splitOptions.separator)
                    .map((v) => v.trim())
                    .map((v) => splitOptions.type === "number" ? Number(v) : v);
                  
                  field.onChange(arr);
                } else {
                  field.onChange(val);
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
