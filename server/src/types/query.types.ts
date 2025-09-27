import type { ZodContentObject } from "@asteasolutions/zod-to-openapi";

import type { KnownKeys } from "./common.types";

export type RequestMediaType = KnownKeys<ZodContentObject> | "multipart/form-data";
