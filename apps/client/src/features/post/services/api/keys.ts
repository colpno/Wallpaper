import type { PostAPIs } from "@repo/types";

export const POST_KEYS = {
  all: () => ["posts"],
  lists: () => [...POST_KEYS.all(), "list"],
  list: (query: PostAPIs.GetMany["query"]) => [...POST_KEYS.lists(), query],
  items: () => [...POST_KEYS.all(), "item"],
  item: (params: PostAPIs.GetOneById["params"]) => [...POST_KEYS.all(), "item", params],
  search: (text: string) => [...POST_KEYS.lists(), text],
} as const;
