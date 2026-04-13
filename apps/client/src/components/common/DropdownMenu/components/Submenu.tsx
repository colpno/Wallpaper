import type { DropdownMenuSubMenu } from "../DropdownMenu.types";

import {
  DropdownMenuPortal,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@repo/ui/components";

import Typography from "@/components/ui/Typography";

import { useDropdownMenuContext } from "../context";
import Group from "./Group";
import Item from "./Item";

function Submenu(item: DropdownMenuSubMenu) {
  const { slotProps } = useDropdownMenuContext();

  return (
    <DropdownMenuSub {...slotProps?.submenu}>
      <DropdownMenuSubTrigger {...slotProps?.submenuTrigger}>
        {item.trigger.icon}

        {typeof item.trigger.label === "string" ? (
          <Typography>{item.trigger.label}</Typography>
        ) : (
          item.trigger.label
        )}

        {item.trigger.shortcut && (
          <DropdownMenuShortcut {...slotProps?.shortcut}>
            {item.trigger.shortcut}
          </DropdownMenuShortcut>
        )}
      </DropdownMenuSubTrigger>

      <DropdownMenuPortal>
        <DropdownMenuSubContent {...slotProps?.submenuContent}>
          {item.data.map((itemOrGroup) =>
            "group" in itemOrGroup ? (
              <Group {...itemOrGroup} key={itemOrGroup.key} />
            ) : (
              <Item {...itemOrGroup} key={itemOrGroup.key} />
            )
          )}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}

export default Submenu;
