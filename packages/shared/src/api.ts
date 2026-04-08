type Route = Record<
  string,
  Record<
    string,
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      path: (...args: any[]) => string;
      method: "get" | "post" | "patch" | "delete";
    }
  >
>;

const BASE_PATH = {
  AUTH: "/auth",
  MEDIA: "/medias",
  POST: "/pins",
  USER: "/users",
} as const;

export const API_ROUTES = {
  AUTH: {
    login: {
      path: () => `${BASE_PATH.AUTH}/login` as const,
      method: "post",
    },
    register: {
      path: () => `${BASE_PATH.AUTH}/register` as const,
      method: "post",
    },
  },
  MEDIA: {
    deleteExpiredMedias: {
      path: () => `${BASE_PATH.MEDIA}/expired` as const,
      method: "delete",
    },
  },
  PIN: {
    getMany: {
      path: () => BASE_PATH.POST,
      method: "get",
    },
    getOneById: {
      path: (id: string) => `${BASE_PATH.POST}/${id}` as const,
      method: "get",
    },
    addOne: {
      path: () => BASE_PATH.POST,
      method: "post",
    },
    updateOneById: {
      path: (id: string) => `${BASE_PATH.POST}/${id}` as const,
      method: "patch",
    },
    removeOneById: {
      path: (id: string) => `${BASE_PATH.POST}/${id}` as const,
      method: "delete",
    },
    removeMany: {
      path: () => BASE_PATH.POST,
      method: "delete",
    },
    undoRemoval: {
      path: () => `${BASE_PATH.POST}/undo-removal` as const,
      method: "patch",
    },
    search: {
      path: () => `${BASE_PATH.POST}/search` as const,
      method: "post",
    },
  },
  USER: {
    updateOneById: {
      path: (id: string) => `${BASE_PATH.USER}/${id}` as const,
      method: "patch",
    },
    deleteOneById: {
      path: (id: string) => `${BASE_PATH.USER}/${id}` as const,
      method: "delete",
    },
  },
} as const satisfies Route;
