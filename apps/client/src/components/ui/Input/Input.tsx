import type { InputProps } from "./Input.types";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";
import { useImperativeHandle, useRef } from "react";

function Input({ addons, uppercase, className, ...props }: InputProps) {
  const ref = useRef<null | HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uppercase) e.target.value = e.target.value.toUpperCase();
    props.onChange?.(e);
  };

  useImperativeHandle(props.ref, () => {
    if (!ref.current) throw new Error("Input not mounted");
    return ref.current;
  });

  return (
    <InputGroup
      className={cn(
        "h-[inherit] overflow-hidden rounded-2xl border-gray-400 px-4 py-1.25 text-base focus-within:ring-1! focus-within:ring-blue-500!",
        props.disabled && "opacity-50",
        className
      )}
    >
      <InputGroupInput
        onChange={handleInputChange}
        {...props}
        ref={ref}
        value={props.value ?? ""}
        className="peer/input p-0! text-base!"
      />

      <InputGroupAddon align="inline-end" className={cn("p-0", !addons?.end && "hidden")}>
        {addons?.end}
      </InputGroupAddon>
    </InputGroup>
  );
}

export default Input;
