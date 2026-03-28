import { Button, Input } from "@repo/ui/components";
import { useRef } from "react";
import { LuSearch, LuX } from "react-icons/lu";

import useClickOutside from "@/hooks/useClickOutside";

const placeholder = "Search for easy dinners, fashion, etc.";

type Props = {
  searchActive: boolean;
  setSearchActive: (active: boolean) => void;
};

function Search({ searchActive, setSearchActive }: Props) {
  const inputRef = useRef<null | HTMLInputElement>(null);

  useClickOutside(inputRef, () => {
    setSearchActive(false);
  });

  if (searchActive) {
    return (
      <div className="flex size-full items-center overflow-hidden rounded-full bg-gray-100 pr-2 pl-4 ring-4 ring-[rgba(0,132,255,0.5)] hover:bg-gray-200">
        <Input
          className="border-none! p-0! shadow-none! ring-0!"
          placeholder={placeholder}
          autoFocus
          ref={inputRef}
        />

        <div className="flex size-12 cursor-pointer items-center justify-center rounded-2xl hover:bg-gray-50">
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-6! rounded-full! border-3! border-black! font-bold!">
            <LuX strokeWidth={3} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex size-full items-center gap-1 overflow-hidden rounded-4xl bg-gray-100 px-2.5 py-1 text-gray-600">
      <Button variant="ghost" size="icon-sm">
        <LuSearch className="size-[18px]" />
      </Button>

      <span className="w-full cursor-text py-2 select-none" onClick={() => setSearchActive(true)}>
        {placeholder}
      </span>
    </div>
  );
}

export default Search;
