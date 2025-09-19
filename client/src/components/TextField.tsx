import { TextField as MUITextField, TextFieldProps } from '@mui/material';
import { FastField, useField } from 'formik';
import { memo } from 'react';

import { FieldErrorMessage, FieldLabel } from './index.ts';

interface Props extends Omit<TextFieldProps, keyof ReturnType<typeof useField>[0]> {
  name: string;
  required?: boolean;
  label?: string;
}

function TextField({ required, fullWidth, label, ...props }: Props) {
  const [field, meta] = useField(props.name);
  const isError = !!meta.error && meta.touched;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.parentNode?.querySelector('label')?.classList.add('!text-accent-1');
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.parentNode?.querySelector('label')?.classList.remove('!text-accent-1');
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
        as={MUITextField}
        onFocus={handleFocus}
        onBlur={handleBlur}
        error={isError}
        fullWidth={fullWidth}
        className="focus:border-accent-1"
      />
      <FieldErrorMessage fieldName={props.name} />
    </div>
  );
}

export default memo(TextField);
