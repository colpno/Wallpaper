import { Input as BaseInput } from "@repo/ui/components";

export type InputProps = React.ComponentProps<typeof BaseInput> & {
  addons?: {
    end?: React.ReactNode;
  };
  uppercase?: boolean;
};
