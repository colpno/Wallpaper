import {
  AutocompleteProps as MUIAutocompleteProps,
  AutocompleteValue as MUIAutocompleteValue,
  TextFieldProps as MUITextFieldProps,
} from '@mui/material';

type BaseTextFieldProps = Omit<
  MUITextFieldProps,
  'label' | 'error' | 'InputLabelProps' | 'fullWidth' | 'placeholder'
>;

export type Option = {
  groupByProperty?: string;
  label: string;
  value: string;
};

type BaseAutocompleteProps<T extends Option> = Omit<
  MUIAutocompleteProps<T, boolean | undefined, boolean | undefined, boolean | undefined>,
  'onChange' | 'renderInput'
>;

export type OnChangeParam<T> = MUIAutocompleteValue<
  T,
  boolean | undefined,
  boolean | undefined,
  boolean | undefined
>;

export interface Props<T extends Option = Option> extends BaseAutocompleteProps<T> {
  name?: string;
  label?: string;
  error?: boolean;
  required?: boolean;
  onChange: (data: OnChangeParam<T>) => void;
  textFieldProps?: BaseTextFieldProps;
  returnLabeOnly?: boolean;
  returnValueOnly?: boolean;
  group?: boolean;
  groupOrder?: 'asc' | 'desc';
  placeholder?: string;
}
