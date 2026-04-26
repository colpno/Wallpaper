import { cn } from "@repo/ui/lib";
import { type ChangeEvent, type KeyboardEvent, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LuSearch, LuX } from "react-icons/lu";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { type FormProps } from "@/components/form/Form";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/constants/common";
import { useClickOutside } from "@/hooks/useClickOutside";

import Input from "../ui/Input";

type Props = {
  placeholder?: string;
} & Omit<FormProps<FormData>, "children" | "schema" | "onSubmit" | "showButtons" | "ref">;

function SearchBar({ placeholder = "Search for easy dinners, fashion, etc.", ...props }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const clickOutsideRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");
  const [isInputFocused, setIsInputFocused] = useState(false);

  useClickOutside(clickOutsideRef, () => setIsInputFocused(false));

  const handleSubmit = (): void => {
    inputRef.current?.blur();

    const params = { q: searchValue };

    if (pathname.startsWith(ROUTES.SEARCH())) {
      setSearchParams(params);
    } else {
      navigate(ROUTES.SEARCH(params));
    }
  };

  const handleInputKeydown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>): void => {
    setSearchValue(e.target.value);
  };

  return (
    <>
      <Input
        ref={inputRef}
        autoComplete="off"
        value={isInputFocused ? searchValue : ""}
        onChange={handleInputChange}
        onKeyUp={handleInputKeydown}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
        placeholder={placeholder}
        className={cn(
          "h-full gap-2 border-none bg-secondary py-0",
          "focus-within:ring-4! focus-within:ring-[rgba(0,132,255,0.5)] hover:bg-neutral-300",
          props.className
        )}
        slotProps={{
          container: {
            ref: clickOutsideRef,
          },
          start: {
            className: cn("group-focus-within/input-group:hidden"),
          },
          end: {
            onMouseDown: (e) => e.preventDefault(),
            className: cn(!searchValue && "hidden", "not-group-focus-within/input-group:hidden!"),
          },
        }}
        addons={{
          start: <LuSearch className="size-4.5 cursor-pointer" onClick={handleSubmit} />,
          end: (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSearchValue("")}
              className="size-11 rounded-2xl hover:bg-gray-50"
            >
              <LuX
                strokeWidth={3}
                className="size-6! rounded-full border-3 border-black p-px text-black"
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
  );
}

export default SearchBar;
