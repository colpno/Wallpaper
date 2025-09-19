export interface CheckboxOption {
  label: string;
  value: string;
}

export interface CheckboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  label?: string;
  options: CheckboxOption[];
  required?: boolean;
}
