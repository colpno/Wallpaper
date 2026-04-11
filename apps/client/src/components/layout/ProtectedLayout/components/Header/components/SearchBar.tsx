import { cn } from "@repo/ui/lib";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LuSearch, LuX } from "react-icons/lu";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import z from "zod";

import TextField from "@/components/form/controls/TextField";
import Form, { type FormProps } from "@/components/form/Form";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/constants/common";
import { useClickOutside } from "@/hooks/useClickOutside";

type Props = {
  placeholder?: string;
} & Omit<FormProps<FormData>, "children" | "schema" | "onSubmit" | "showButtons" | "ref">;

const schema = z.object({
  q: z.string(),
});
type FormData = z.infer<typeof schema>;

function SearchBar({ placeholder = "Search for easy dinners, fashion, etc.", ...props }: Props) {
  const clickOutsideRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const defaultFormValues: FormData = {
    q: searchParams.get("q") || "",
  };

  const handleSubmit = (formData: FormData): void => {
    if (inputRef.current) {
      inputRef.current.blur();
    }

    if (pathname.startsWith(ROUTES.SEARCH())) {
      setSearchParams(formData);
    } else {
      const a = ROUTES.SEARCH(formData);
      navigate(a);
    }
  };

  useClickOutside(clickOutsideRef, () => setIsInputFocused(false));

  return (
    <Form
      {...props}
      schema={schema}
      onSubmit={handleSubmit}
      showButtons={false}
      ref={clickOutsideRef}
      defaultValues={defaultFormValues}
      className="h-full flex-1"
    >
      {({ getValues, setValue }) => (
        <>
          <TextField
            ref={inputRef}
            name="q"
            autoComplete="off"
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder={placeholder}
            slotProps={{
              fieldContainer: {
                className: cn("h-full"),
              },
            }}
            className={cn(
              "h-full! gap-2 border-none bg-secondary py-0",
              "focus-within:ring-4! focus-within:ring-[rgba(0,132,255,0.5)]! hover:bg-neutral-300",
              props.className
            )}
            addons={{
              start: <LuSearch className={cn("size-[18px]", isInputFocused && "hidden")} />,
              end: (
                <Button
                  variant="ghost-icon"
                  onClick={() => setValue("q", "")}
                  className={cn(
                    "size-11 rounded-2xl hover:bg-gray-50",
                    (!isInputFocused || !getValues("q")) && "hidden"
                  )}
                >
                  <LuX
                    strokeWidth={3}
                    className="size-6 rounded-full border-3 border-black p-px text-black"
                  />
                </Button>
              ),
            }}
          />

          {isInputFocused &&
            createPortal(
              <div className="fixed top-0 right-0 bottom-0 left-0 z-header-search-overlay bg-[#0006]" />,
              document.body
            )}
        </>
      )}
    </Form>
  );
}

export default SearchBar;
