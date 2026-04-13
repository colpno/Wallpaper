import type { DropdownMenuProps } from "./DropdownMenu.types";

import {
  DropdownMenu as UIDropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/components";

import Group from "./components/Group";
import Item from "./components/Item";
import { DropdownMenuContext } from "./context";

function DropdownMenu({ data, trigger, slotProps, ...props }: DropdownMenuProps) {
  return (
    <DropdownMenuContext value={{ slotProps }}>
      <UIDropdownMenu {...props}>
        {trigger && <DropdownMenuTrigger {...slotProps?.trigger}>{trigger}</DropdownMenuTrigger>}

        <DropdownMenuContent {...slotProps?.content}>
          {data.map((itemOrGroup) =>
            "group" in itemOrGroup ? (
              <Group {...itemOrGroup} key={itemOrGroup.key} />
            ) : (
              <Item {...itemOrGroup} key={itemOrGroup.key} />
            )
          )}
        </DropdownMenuContent>
      </UIDropdownMenu>
    </DropdownMenuContext>
  );
}

export default DropdownMenu;
