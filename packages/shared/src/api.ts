const BASE_PATH = {
  AUTH: "/auth",
  MEDIA: "/medias",
  PIN: "/pins",
  USER: "/users",
  SAVED_IDEA: "/saved-ideas",
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
      path: () => BASE_PATH.PIN,
      method: "get",
    },
    getManyWithSaves: {
      path: () => `${BASE_PATH.PIN}/saved` as const,
      method: "get",
    },
    getOneById: {
      path: (id: string) => `${BASE_PATH.PIN}/${id}` as const,
      method: "get",
    },
    addOne: {
      path: () => BASE_PATH.PIN,
      method: "post",
    },
    updateOneById: {
      path: (id: string) => `${BASE_PATH.PIN}/${id}` as const,
      method: "patch",
    },
    deleteOneById: {
      path: (id: string) => `${BASE_PATH.PIN}/${id}` as const,
      method: "delete",
    },
    removeMany: {
      path: () => BASE_PATH.PIN,
      method: "delete",
    },
    undoRemoval: {
      path: () => `${BASE_PATH.PIN}/undo-removal` as const,
      method: "patch",
    },
    search: {
      path: () => `${BASE_PATH.PIN}/search` as const,
      method: "post",
    },
    searchManyById: {
      path: (id: string) => `${BASE_PATH.PIN}/${id}/search` as const,
      method: "get",
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

  SAVED_IDEA: {
    getMany: {
      path: () => BASE_PATH.SAVED_IDEA,
      method: "get",
    },
    checkSaved: {
      path: () => `${BASE_PATH.SAVED_IDEA}/check` as const,
      method: "get",
    },
    addOne: {
      path: () => BASE_PATH.SAVED_IDEA,
      method: "post",
    },
    deleteOneById: {
      path: (id: string) => `${BASE_PATH.SAVED_IDEA}/${id}` as const,
      method: "delete",
    },
  },
} as const satisfies Record<
  keyof typeof BASE_PATH,
  Record<
    string,
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      path: (...args: any[]) => string;
      method: "get" | "post" | "patch" | "delete";
    }
  >
>;
