export const ROUTES = {
  SAVED_IDEA_PINS: (username: string) => `/${username}/pins` as const,
  PROFILE_SAVES: (username: string) => `/${username}/saved` as const,
  PROFILE_CREATES: (username: string) => `/${username}/created` as const,
  PROFILE: (username: string) => `/${username}` as const,
  PIN_CREATION: () => "/pin-creation-tool" as const,
  PIN: (id: string) => `/pin/${id}` as const,
  HOME: () => "/" as const,
  EXPLORE: () => "/ideas" as const,
  SEARCH: (params?: { q: string }) => {
    const basePath = "/search" as const;
    if (!params) return basePath;
    const qs = new URLSearchParams(params);
    return `${basePath}?${qs.toString()}` as const;
  },
} as const;

export const INITIAL_PAGE = 1;
export const INFINITE_PAGE_SIZE = 30;

/**
 * Maximum score returned by Mongodb $vectorSearch
 */
export const MAX_SIMILARITY_SCORE = 1;
