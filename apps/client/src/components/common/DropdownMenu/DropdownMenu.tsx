import type { DropdownMenuProps } from "./DropdownMenu.types";

import {
  DropdownMenu as UIDropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/components";
import { cn } from "@repo/ui/lib";

import Content from "./components/Content";
import { DropdownMenuProvider } from "./DropdownMenu.context";

function DropdownMenu({ data, trigger, slotProps, ...props }: DropdownMenuProps) {
  return (
    <DropdownMenuProvider value={{ slotProps }}>
      <UIDropdownMenu {...props}>
        {trigger && <DropdownMenuTrigger {...slotProps?.trigger}>{trigger}</DropdownMenuTrigger>}

        <DropdownMenuContent
          {...slotProps?.content}
          className={cn("p-3", slotProps?.content?.className)}
        >
          <Content data={data} />
        </DropdownMenuContent>
      </UIDropdownMenu>
    </DropdownMenuProvider>
  );
}

export default DropdownMenu;
