import {
  Dialog as UIDialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Separator,
} from "@repo/ui/components";
import { cn } from "@repo/ui/lib";

import Button from "../ui/Button";

type Props = {
  trigger?: React.ReactNode;
  slotProps?: {
    trigger?: React.ComponentProps<typeof DialogTrigger>;
    header?: React.ComponentProps<typeof DialogHeader>;
    footer?: React.ComponentProps<typeof DialogFooter>;
    contentContainer?: React.ComponentProps<"div">;
  };
  showFooter?: boolean;
} & React.ComponentProps<typeof DialogContent> &
  Pick<React.ComponentProps<typeof UIDialog>, "onOpenChange" | "open" | "modal" | "defaultOpen">;

function Dialog({
  children,
  onOpenChange,
  open,
  modal,
  defaultOpen,
  title,
  trigger,
  slotProps,
  showFooter = true,
  ...props
}: Props) {
  return (
    <UIDialog open={open} onOpenChange={onOpenChange} modal={modal} defaultOpen={defaultOpen}>
      {!!trigger && <DialogTrigger {...slotProps?.trigger}>{trigger}</DialogTrigger>}

      <DialogContent
        {...props}
        className={cn("flex max-h-dvh max-w-6xl flex-col", props.className)}
      >
        <DialogHeader
          {...slotProps?.header}
          className={cn(!title && "sr-only", slotProps?.header?.className)}
        >
          <DialogTitle>{title}</DialogTitle>

          {!!title && <Separator />}
        </DialogHeader>

        <div
          {...slotProps?.contentContainer}
          className={cn("-mx-4 overflow-y-auto px-4", slotProps?.contentContainer?.className)}
        >
          {children}
        </div>

        {showFooter && (
          <DialogFooter
            {...slotProps?.footer}
            className={cn("justify-center", slotProps?.footer?.className)}
          >
            <DialogClose asChild>
              <Button className="w-full">Close</Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </UIDialog>
  );
}

export default Dialog;
