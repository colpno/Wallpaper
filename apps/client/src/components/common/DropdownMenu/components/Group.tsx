import type { DropdownMenuGroup as GroupType } from "../DropdownMenu.types";

import { DropdownMenuGroup, DropdownMenuLabel } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";

import { useDropdownMenuContext } from "../context";
import Item from "./Item";

function Group(group: GroupType) {
  const { slotProps } = useDropdownMenuContext();

  return (
    <DropdownMenuGroup {...slotProps?.group}>
      {group.label && (
        <DropdownMenuLabel
          {...slotProps?.groupLabel}
          className={cn("text-xs text-gray-500", slotProps?.groupLabel?.className)}
        >
          {group.label}
        </DropdownMenuLabel>
      )}

      {group.group.map((item) => (
        <Item {...item} key={item.key} />
      ))}
    </DropdownMenuGroup>
  );
}

export default Group;
