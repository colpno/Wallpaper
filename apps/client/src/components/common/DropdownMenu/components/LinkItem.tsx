import type { DropdownMenuItemLinkContent } from "../DropdownMenu.types";

import { DropdownMenuItem, DropdownMenuShortcut } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";

import Link from "@/components/ui/Link";
import Typography from "@/components/ui/Typography";

import { useDropdownMenu } from "../DropdownMenu.context";

function LinkItem({ icon, label, shortcut, className, to, ...props }: DropdownMenuItemLinkContent) {
  const { slotProps } = useDropdownMenu();

  return (
    <DropdownMenuItem
      {...slotProps?.item}
      {...props}
      asChild
      className={cn("font-medium", slotProps?.item?.className)}
    >
      <Link to={to} navlink className={className}>
        {(state) => (
          <>
            {typeof icon === "function" ? icon(state) : icon}

            {typeof label === "string" ? (
              <Typography>{label}</Typography>
            ) : typeof label === "function" ? (
              label(state)
            ) : (
              label
            )}

            {shortcut && (
              <DropdownMenuShortcut {...slotProps?.shortcut}>
                {typeof shortcut === "function" ? shortcut(state) : shortcut}
              </DropdownMenuShortcut>
            )}
          </>
        )}
      </Link>
    </DropdownMenuItem>
  );
}

export default LinkItem;
