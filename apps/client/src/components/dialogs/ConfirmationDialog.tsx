import {
  AlertDialog as UIAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Separator,
} from "@repo/ui/components";
import { cn } from "@repo/ui/lib";

type Props = {
  trigger?: React.ReactNode;
  onConfirm?: (confirm: boolean) => void;
  slotProps?: {
    trigger?: React.ComponentProps<typeof AlertDialogTrigger>;
    header?: React.ComponentProps<typeof AlertDialogHeader>;
    title?: React.ComponentProps<typeof AlertDialogTitle>;
    footer?: React.ComponentProps<typeof AlertDialogFooter>;
    cancelButton?: Partial<Omit<React.ComponentProps<typeof AlertDialogCancel>, "onClick">>;
    confirmButton?: Partial<Omit<React.ComponentProps<typeof AlertDialogAction>, "onClick">>;
  };
} & React.ComponentProps<typeof AlertDialogContent> &
  Pick<React.ComponentProps<typeof UIAlertDialog>, "onOpenChange" | "open">;

function ConfirmationDialog({
  children,
  open,
  onOpenChange,
  title,
  trigger,
  onConfirm,
  slotProps,
  ...props
}: Props) {
  return (
    <UIAlertDialog open={open} onOpenChange={onOpenChange}>
      {!!trigger && <AlertDialogTrigger {...slotProps?.trigger}>{trigger}</AlertDialogTrigger>}

      <AlertDialogContent {...props}>
        <AlertDialogHeader
          {...slotProps?.header}
          className={cn(!title && "sr-only", slotProps?.header?.className)}
        >
          <AlertDialogTitle
            {...slotProps?.title}
            className={cn("w-full text-center text-2xl", slotProps?.title?.className)}
          >
            {title}
          </AlertDialogTitle>

          {!!title && <Separator />}
        </AlertDialogHeader>

        <div className="-mx-4 max-h-[70dvh] overflow-y-auto px-4 md:max-h-[80dvh]">{children}</div>

        <AlertDialogFooter
          {...slotProps?.footer}
          className={cn("justify-center", slotProps?.footer?.className)}
        >
          <AlertDialogCancel
            variant="secondary"
            size="sm"
            {...slotProps?.cancelButton}
            onClick={() => onConfirm?.(false)}
          >
            {slotProps?.cancelButton?.children ? slotProps?.cancelButton?.children : "Cancel"}
          </AlertDialogCancel>

          <AlertDialogAction
            size="sm"
            variant="default"
            {...slotProps?.confirmButton}
            onClick={() => onConfirm?.(true)}
          >
            {slotProps?.confirmButton?.children ? slotProps?.confirmButton?.children : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </UIAlertDialog>
  );
}

export default ConfirmationDialog;
