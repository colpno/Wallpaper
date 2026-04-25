import { FormLabel as UIFormLabel } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";
import { AiOutlineExclamationCircle } from "react-icons/ai";

import Tooltip from "../common/Tooltip";
import Button from "../ui/Button";

type Props = {
  hint?: string;
} & React.ComponentProps<typeof UIFormLabel>;

function Label({ children, hint, ...props }: Props) {
  if (hint) {
    return (
      <UIFormLabel {...props} className={cn("flex items-end", props.className)}>
        {children}{" "}
        <Tooltip
          trigger={
            <Button variant="ghost" size="icon-xs" className="text-base">
              <AiOutlineExclamationCircle />
            </Button>
          }
          slotProps={{
            trigger: { asChild: true },
          }}
          className={cn("max-w-xs")}
        >
          {hint}
        </Tooltip>
      </UIFormLabel>
    );
  }

  return <UIFormLabel {...props}>{children}</UIFormLabel>;
}

export default Label;
