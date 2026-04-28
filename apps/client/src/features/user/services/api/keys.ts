import type { UserAPIs } from "@repo/types";

export const USER_KEYS = {
  all: ["users"] as const,
  items: () => [...USER_KEYS.all, "item"],
  item: (query: UserAPIs.GetOne["query"]) => [...USER_KEYS.all, "item", query],
};
