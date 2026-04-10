import { InputGroup, InputGroupAddon, InputGroupInput } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";

export type InputProps = {
  uppercase?: boolean;
  addons?: {
    start?: React.ReactNode;
    end?: React.ReactNode;
  };
  slotProps?: {
    container?: Omit<React.ComponentProps<typeof InputGroup>, "className">;
    input?: Pick<React.ComponentProps<typeof InputGroupInput>, "className">;
    start?: Omit<React.ComponentProps<typeof InputGroupAddon>, "align">;
    end?: Omit<React.ComponentProps<typeof InputGroupAddon>, "align">;
  };
} & React.ComponentProps<typeof InputGroupInput>;

function Input({ addons, uppercase, className, slotProps, ...props }: InputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uppercase) e.target.value = e.target.value.toUpperCase();
    props.onChange?.(e);
  };

  return (
    <InputGroup
      {...slotProps?.container}
      className={cn(
        "h-[inherit] overflow-hidden rounded-2xl border-gray-400 px-4 py-1.25 text-base focus-within:ring-1! focus-within:ring-blue-500!",
        props.disabled && "opacity-50",
        className
      )}
    >
      <InputGroupAddon
        {...slotProps?.start}
        align="inline-start"
        className={cn("p-0", !addons?.start && "hidden", slotProps?.start?.className)}
      >
        {addons?.start}
      </InputGroupAddon>

      <InputGroupInput
        {...props}
        onChange={handleInputChange}
        value={props.value ?? ""}
        className={cn("p-0! text-base!", slotProps?.input?.className)}
      />

      <InputGroupAddon
        {...slotProps?.end}
        align="inline-end"
        className={cn("p-0", !addons?.end && "hidden", slotProps?.end?.className)}
      >
        {addons?.end}
      </InputGroupAddon>
    </InputGroup>
  );
}

export default Input;
