export const SAVED_IDEA_KEYS = {
  all: () => ["saved-ideas"],
  check: (userId: string, pinId: string) => [...SAVED_IDEA_KEYS.all(), "check", userId, pinId],
} as const;
