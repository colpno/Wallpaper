import { Button, Input } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LuSearch, LuX } from "react-icons/lu";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { ROUTES } from "@/constants/common";
import { useClickOutside } from "@/hooks/useClickOutside";

type Props = {
  placeholder?: string;
} & React.ComponentProps<"div">;

function SearchBar({ placeholder = "Search for easy dinners, fashion, etc.", ...props }: Props) {
  const clickOutsideRef = useRef<null | HTMLInputElement>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const { pathname } = useLocation();
  const [isSearching, setIsSearching] = useState(false);
  const [isInputFocus, setIsInputFocus] = useState(false);
  const [searchValue, setSearchValue] = useState(qParam);

  useEffect(() => {
    if (qParam) setSearchValue(qParam);
  }, [qParam]);

  useClickOutside(clickOutsideRef, () => {
    setIsSearching(false);
  });

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.code === "Enter" && searchValue) {
      if (pathname.startsWith(ROUTES.SEARCH(""))) {
        setSearchParams({ q: searchValue });
      } else {
        navigate(ROUTES.SEARCH(searchValue));
      }
    }
  };

  const handleInputFocus = (): void => {
    setIsInputFocus(true);
    setIsSearching(true);
  };

  const handleInputBlur = (): void => {
    setIsInputFocus(false);
    setIsSearching(false);
  };

  return (
    <div
      {...props}
      ref={clickOutsideRef}
      className={cn(
        "flex h-full items-center gap-2 overflow-hidden rounded-4xl bg-secondary px-4 py-0.5 text-gray-600 focus-within:ring-4 focus-within:ring-[rgba(0,132,255,0.5)] hover:bg-neutral-300",
        props.className
      )}
    >
      {!isSearching && <LuSearch className="size-[18px]" />}

      <Input
        value={isSearching ? searchValue : placeholder}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleInputKeyDown}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        className="flex-1 border-none p-0 text-base! shadow-none ring-0!"
        autoFocus
      />

      {isInputFocus && !!searchValue && (
        <div className="flex size-12 cursor-pointer items-center justify-center rounded-2xl hover:bg-gray-50">
          <Button
            variant="ghost-icon"
            size="sm"
            className="size-6 rounded-full border-3 border-black font-bold"
          >
            <LuX strokeWidth={3} />
          </Button>
        </div>
      )}

      {isSearching &&
        createPortal(
          <div className="fixed top-0 right-0 bottom-0 left-0 z-9 bg-[#0006]" />,
          document.body
        )}
    </div>
  );
}

export default SearchBar;
