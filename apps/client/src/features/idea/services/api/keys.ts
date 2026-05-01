import type { IdeaAPIs } from "@repo/types";

export const IDEA_KEYS = {
  all: () => ["ideas"],
  lists: () => [...IDEA_KEYS.all(), "list"],
  list: (query: IdeaAPIs.GetMany["query"]) => [...IDEA_KEYS.lists(), query],
  check: (userId: string, pinId: string) => [...IDEA_KEYS.all(), "check", userId, pinId],
} as const;
