const POST_KEYS = {
  all: () => ["posts"] as const,
  list: () => [...POST_KEYS.all(), "list"] as const,
  one: (postId: number) => [...POST_KEYS.all(), "one", postId] as const,
};
