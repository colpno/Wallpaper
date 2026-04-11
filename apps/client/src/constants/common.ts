export const ROUTES = {
  PIN: (id: string) => `/pin/${id}`,
  HOME: () => "/",
  IDEAS: () => "/ideas",
  SEARCH: (params?: { q: string }) => {
    const basePath = "/search";
    if (!params) return basePath;
    const qs = new URLSearchParams(params);
    return `${basePath}?${qs.toString()}`;
  },
} as const;

export const INITIAL_PAGE = 1;
export const INFINITE_PAGE_SIZE = 30;

/**
 * Maximum score returned by Mongodb $vectorSearch
 */
export const MAX_SIMILARITY_SCORE = 1;
