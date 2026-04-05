export const ROUTES = {
  HOME: () => "/",
  IDEAS: () => "/ideas",
  SEARCH: (searchValue?: string) => {
    const basePath = "/search";
    if (!searchValue) return basePath;
    const qs = new URLSearchParams({ q: searchValue });
    return `${basePath}?${qs.toString()}`;
  },
} as const;

export const INITIAL_PAGE = 1;
export const INFINITE_PAGE_SIZE = 30;
