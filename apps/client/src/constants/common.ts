export const ROUTES = {
  PROFILE: (username: string) => `/${username}` as const,
  PIN_CREATION: () => "/pin-creation-tool" as const,
  PIN: (id: string) => `/pin/${id}` as const,
  HOME: () => "/" as const,
  IDEAS: () => "/ideas" as const,
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
