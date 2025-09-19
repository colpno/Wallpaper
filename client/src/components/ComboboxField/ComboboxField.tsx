import { FastField, useField } from 'formik';
import { ComponentProps, memo } from 'react';

import FieldErrorMessage from '../FieldErrorMessage.tsx';
import FieldLabel from '../FieldLabel.tsx';
import Combobox from './Combobox.tsx';

interface Props
  extends Omit<ComponentProps<typeof Combobox>, 'name' | 'value' | 'onChange' | 'onBlur'> {
  name: string;
  label?: string;
}

function ComboboxField({ name, label, fullWidth, required, ...props }: Props) {
  const [field, meta] = useField(name);
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
        htmlFor={name}
        error={isError}
        required={required}
      />
      <FastField
        {...props}
        {...field}
        as={Combobox}
        onFocus={handleFocus}
        onBlur={handleBlur}
        error={isError}
        fullWidth={fullWidth}
      />
      <FieldErrorMessage fieldName={name} />
    </div>
  );
}

export default memo(ComboboxField);
