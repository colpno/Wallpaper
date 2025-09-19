import { TypographyProps as MUITypographyProps } from '@mui/material';

export type TypoAsTypographyProps = MUITypographyProps;

export type TypoAsHyperLinkProps = MUITypographyProps & {
  href: string;
  external?: false;
};

export type TypoAsCopyableTextProps = MUITypographyProps & {
  children: string;
  copyable?: boolean;
};

export type TypographyProps =
  | TypoAsTypographyProps
  | TypoAsHyperLinkProps
  | TypoAsCopyableTextProps;
