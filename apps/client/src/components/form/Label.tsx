import {
  FormLabel as UIFormLabel,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components";
import { cn } from "@repo/ui/lib";
import { AiOutlineExclamationCircle } from "react-icons/ai";

import Button from "../ui/Button";

type Props = {
  hint?: string;
} & React.ComponentProps<typeof UIFormLabel>;

function Label({ children, hint, ...props }: Props) {
  if (hint) {
    return (
      <UIFormLabel {...props} className={cn("flex items-end", props.className)}>
        {children}{" "}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost-icon" size="sm" className="text-base">
              <AiOutlineExclamationCircle />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">{hint}</TooltipContent>
        </Tooltip>
      </UIFormLabel>
    );
  }

  return <UIFormLabel {...props}>{children}</UIFormLabel>;
}

export default Label;
