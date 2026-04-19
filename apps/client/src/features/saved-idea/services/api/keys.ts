import type { SavedIdeaAPIs } from "@repo/types";

export const SAVED_IDEA_KEYS = {
  all: () => ["saved-ideas"],
  lists: () => [...SAVED_IDEA_KEYS.all(), "list"],
  list: (query: SavedIdeaAPIs.GetMany["query"]) => [...SAVED_IDEA_KEYS.lists(), query],
  check: (userId: string, pinId: string) => [...SAVED_IDEA_KEYS.all(), "check", userId, pinId],
} as const;
