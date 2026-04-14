import type { DropdownMenuRadioGroup as DropdownMenuRadioGroupType } from "../DropdownMenu.types";

import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
} from "@repo/ui/components";
import { cn } from "@repo/ui/lib";

import Typography from "@/components/ui/Typography";

import { useDropdownMenuContext } from "../context";

function RadioGroup(item: DropdownMenuRadioGroupType) {
  const { slotProps } = useDropdownMenuContext();

  const handleValueChange = (value: string): void => {
    item.onChange?.(value);
  };

  return (
    <DropdownMenuGroup {...slotProps?.group}>
      {item.label && (
        <DropdownMenuLabel
          {...slotProps?.groupLabel}
          className={cn("text-xs text-gray-500", slotProps?.groupLabel?.className)}
        >
          {item.label}
        </DropdownMenuLabel>
      )}

      <DropdownMenuRadioGroup
        {...slotProps?.radioGroup}
        value={item.value}
        onValueChange={handleValueChange}
      >
        {item.radios.map((radio) => (
          <DropdownMenuRadioItem
            {...slotProps?.radioItem}
            key={radio.value}
            value={radio.value}
            className={cn("font-medium", slotProps?.radioItem?.className)}
          >
            {radio.icon}

            {typeof radio.label === "string" ? <Typography>{radio.label}</Typography> : radio.label}

            {radio.shortcut && (
              <DropdownMenuShortcut {...slotProps?.shortcut}>{radio.shortcut}</DropdownMenuShortcut>
            )}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </DropdownMenuGroup>
  );
}

export default RadioGroup;
