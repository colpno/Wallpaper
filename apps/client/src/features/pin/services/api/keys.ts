import type { PinAPIs } from "@repo/types";

export const PIN_KEYS = {
  all: () => ["pins"],
  lists: () => [...PIN_KEYS.all(), "list"],
  list: (query: PinAPIs.GetMany["query"]) => [...PIN_KEYS.lists(), query],
  items: () => [...PIN_KEYS.all(), "item"],
  item: (params: PinAPIs.GetOneById["params"]) => [...PIN_KEYS.all(), "item", params],
  searchLists: () => [...PIN_KEYS.lists(), "search"],
  searchList: (input: PinAPIs.Search["body"]) => [...PIN_KEYS.searchLists(), input],
} as const;
