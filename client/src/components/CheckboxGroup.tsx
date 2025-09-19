import { FastField, useField } from 'formik';
import { memo } from 'react';
import { v4 } from 'uuid';

import { CheckboxGroupProps as Props } from '~/types/checkboxTypes.ts';
import { cn } from '~/utils/cssUtils.ts';
import { Checkbox, FieldErrorMessage, FieldLabel } from './index.ts';

function CheckboxGroup({ options, label, required, name, ...props }: Props) {
  const uuid = v4();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ checked, value, ...field }, meta] = useField({
    name: name,
    type: 'checkbox',
  });
  const isError = !!meta.error && meta.touched;

  if (!Array.isArray(meta.initialValue)) {
    throw new Error(`${field.name}'s value must be an array`);
  }

  return (
    <div>
      <FieldLabel component="label" children={label} error={isError} required={required} />
      <div {...props} role="group" className={cn('grid', props.className)}>
        {options.map((item, i) => (
          <FastField {...field} {...item} key={`${uuid}-${i}`} type="checkbox" as={Checkbox} />
        ))}
      </div>
      <FieldErrorMessage fieldName={name} />
    </div>
  );
}

export default memo(CheckboxGroup);
