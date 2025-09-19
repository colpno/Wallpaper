import { ButtonProps as MUIButtonProps, IconButtonProps } from '@mui/material';

import { ReplaceTypeKeys } from './commonTypes.ts';

type HTMLButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
type ButtonAs = 'button' | 'unstyled' | 'icon';

interface BaseProps {
  loading?: boolean;
  disableTextTransform?: boolean;
  href?: string;
  external?: boolean;
}

export interface ButtonAsButtonProps extends ReplaceTypeKeys<MUIButtonProps, BaseProps> {
  as?: Extract<ButtonAs, 'button'>;
}

export interface ButtonAsIconProps extends ReplaceTypeKeys<IconButtonProps, BaseProps> {
  as: Extract<ButtonAs, 'icon'>;
}

export interface ButtonAsUnstyledProps extends HTMLButtonProps {
  as: Extract<ButtonAs, 'unstyled'>;
}

export type ButtonProps = ButtonAsButtonProps | ButtonAsIconProps | ButtonAsUnstyledProps;
