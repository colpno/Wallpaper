import { cn } from "@repo/ui/lib";

import Dialog from "./Dialog";

function FormDialog(props: React.ComponentProps<typeof Dialog>) {
  return (
    <Dialog
      {...props}
      showCloseButton={props.showCloseButton ?? true}
      showFooter={props.showFooter ?? false}
      className={cn("rounded-4xl", props.className)}
    />
  );
}

export default FormDialog;
