import { Autocomplete as MUIAutocomplete, TextField as MUITextField } from '@mui/material';
import { memo } from 'react';

import { OnChangeParam, Option, Props } from './types.ts';

function Combobox<T extends Option = Option>({
  options,
  onChange: onChangeProp,
  error,
  label,
  required,
  placeholder,
  textFieldProps,
  returnValueOnly,
  defaultValue,
  group,
  groupOrder,
  ...props
}: Props<T>) {
  const handleChange = (data: OnChangeParam<T>) => {
    const getValue = (val: string) => {
      if (returnValueOnly) return options.find((option) => option.value === val)!.value;
      return val;
    };

    // Multiple selection
    if (Array.isArray(data)) {
      const result = data.map((item) => {
        if (typeof item === 'string') return getValue(item);
        return returnValueOnly ? (item as T).value : item;
      });
      onChangeProp(result);
      return;
    }

    // Single selection
    if (typeof data === 'string') {
      onChangeProp(getValue(data));
      return;
    }

    throw new Error('Invalid data type of handleChange');
  };

  const evaluateOptions = () => {
    return group
      ? groupOrder === 'desc'
        ? options.slice().sort((a, b) => b.groupByProperty!.localeCompare(a.groupByProperty!))
        : options.slice().sort((a, b) => a.groupByProperty!.localeCompare(b.groupByProperty!))
      : options;
  };

  return (
    <MUIAutocomplete
      {...props}
      defaultValue={defaultValue ?? props.multiple ? [] : null}
      options={evaluateOptions()}
      onChange={(_, data) => handleChange(data)}
      renderInput={({ InputLabelProps, ...params }) => (
        <MUITextField
          variant="outlined"
          {...textFieldProps}
          {...params}
          slotProps={{ inputLabel: { ...InputLabelProps, required } }}
          label={label}
          error={error}
          placeholder={placeholder}
        />
      )}
    />
  );
}

export default memo(Combobox);
