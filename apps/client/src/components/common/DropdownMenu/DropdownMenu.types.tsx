import {
  DropdownMenu as UIDropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@repo/ui/components";

import { type LinkAsNavLinkProps } from "@/components/ui/Link";

export type DropdownMenuItemBaseContent = {
  icon?: React.ReactNode;
  label: React.ReactNode;
  shortcut?: React.ReactNode;
} & Partial<Omit<React.ComponentProps<typeof DropdownMenuItem>, "children">>;

export type DropdownMenuItemLinkContent = {
  to: string;
  icon?: LinkAsNavLinkProps["children"];
  label: LinkAsNavLinkProps["children"];
  shortcut?: LinkAsNavLinkProps["children"];
  className?: LinkAsNavLinkProps["className"];
} & Partial<Omit<React.ComponentProps<typeof DropdownMenuItem>, "children" | "className">>;

export type DropdownMenuSubMenu = {
  trigger: DropdownMenuItemBaseContent;
  data: DropdownMenuProps["data"];
};

export type DropdownMenuItem = {
  /**
   * An unique identity of the item.
   */
  key: string;
} & (DropdownMenuItemBaseContent | DropdownMenuItemLinkContent | DropdownMenuSubMenu);

export type DropdownMenuGroup = {
  /**
   * An unique identity of the group.
   */
  key: string;
  label?: React.ReactNode;
  group: DropdownMenuItem[];
};

export type DropdownMenuData = (DropdownMenuItem | DropdownMenuGroup)[];

export type DropdownMenuProps = {
  data: DropdownMenuData;
  trigger?: React.ReactNode;
  slotProps?: {
    container?: React.ComponentProps<typeof UIDropdownMenu>;
    trigger?: React.ComponentProps<typeof DropdownMenuTrigger>;
    content?: React.ComponentProps<typeof DropdownMenuContent>;
  } & NonNullable<ContextState["slotProps"]>;
} & React.ComponentProps<typeof UIDropdownMenu>;

export type ContextState = {
  slotProps?: {
    shortcut?: React.ComponentProps<typeof DropdownMenuShortcut>;
    item?: React.ComponentProps<typeof DropdownMenuItem>;
    group?: React.ComponentProps<typeof DropdownMenuGroup>;
    groupLabel?: React.ComponentProps<typeof DropdownMenuLabel>;
    submenu?: React.ComponentProps<typeof DropdownMenuSub>;
    submenuTrigger?: React.ComponentProps<typeof DropdownMenuSubTrigger>;
    submenuContent?: React.ComponentProps<typeof DropdownMenuSubContent>;
  };
};
