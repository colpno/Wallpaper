import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@repo/ui/components";

type Props = {
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  slotProps?: {
    container?: React.ComponentProps<typeof UITooltip>;
    trigger?: React.ComponentProps<typeof TooltipTrigger>;
  };
} & React.ComponentProps<typeof TooltipContent>;

function Tooltip({ trigger, children, slotProps, ...props }: Props) {
  return (
    <UITooltip {...slotProps?.container}>
      {trigger && <TooltipTrigger {...slotProps?.trigger}>{trigger}</TooltipTrigger>}

      <TooltipContent {...props}>{children}</TooltipContent>
    </UITooltip>
  );
}

export default Tooltip;
