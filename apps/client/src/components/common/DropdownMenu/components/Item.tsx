import type { DropdownMenuItem as ItemType } from "../DropdownMenu.types";

import { DropdownMenuItem, DropdownMenuShortcut } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";

import Typography from "@/components/ui/Typography";

import { useDropdownMenuContext } from "../context";
import LinkItem from "./LinkItem";
import Submenu from "./Submenu";

function Item(item: ItemType) {
  const { slotProps } = useDropdownMenuContext();

  // Link
  if ("to" in item) {
    return <LinkItem {...item} />;
  }

  // Submenu
  if ("trigger" in item) {
    return <Submenu {...item} />;
  }

  // Item
  const { icon, label, shortcut, ...props } = item;

  return (
    <DropdownMenuItem
      {...slotProps?.item}
      {...props}
      className={cn("font-medium", slotProps?.item?.className, props.className)}
    >
      {icon}

      {typeof label === "string" ? <Typography>{label}</Typography> : label}

      {shortcut && <DropdownMenuShortcut {...slotProps?.shortcut}>{shortcut}</DropdownMenuShortcut>}
    </DropdownMenuItem>
  );
}

export default Item;
