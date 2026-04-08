import type { PinAPIs } from "@repo/types";

export const PIN_KEYS = {
  all: () => ["posts"],
  lists: () => [...PIN_KEYS.all(), "list"],
  list: (query: PinAPIs.GetMany["query"]) => [...PIN_KEYS.lists(), query],
  items: () => [...PIN_KEYS.all(), "item"],
  item: (params: PinAPIs.GetOneById["params"]) => [...PIN_KEYS.all(), "item", params],
  search: (text: string) => [...PIN_KEYS.lists(), text],
} as const;
