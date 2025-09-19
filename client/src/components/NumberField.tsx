import { FastField, useField } from 'formik';
import React, { memo } from 'react';

import { FieldErrorMessage, FieldLabel, NumberInput } from './index.ts';

interface Props
  extends Omit<React.ComponentProps<typeof NumberInput>, keyof ReturnType<typeof useField>[0]> {
  name: string;
  required?: boolean;
  label?: string;
}

function NumberField({ fullWidth, required, label, ...props }: Props) {
  const [field, meta] = useField(props);
  const isError = !!meta.error && meta.touched;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.parentElement?.classList.add('!border-accent-1');
    e.target.parentNode?.parentNode?.querySelector('label')?.classList.add('!text-accent-1');
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.parentElement?.classList.remove('!border-accent-1');
    e.target.parentNode?.parentNode?.querySelector('label')?.classList.remove('!text-accent-1');
  };

  return (
    <div>
      <FieldLabel
        children={label}
        component="label"
        htmlFor={props.name}
        error={isError}
        required={required}
      />
      <FastField
        {...props}
        {...field}
        as={NumberInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        error={isError}
        fullWidth={fullWidth}
      />
      <FieldErrorMessage fieldName={props.name} />
    </div>
  );
}

export default memo(NumberField);
