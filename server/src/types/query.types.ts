import type { ZodContentObject } from "@asteasolutions/zod-to-openapi";
import { Types } from "@wallpaper/shared";

import type { KnownKeys } from "./common.types";

export type RequestMediaType = KnownKeys<ZodContentObject> | "multipart/form-data";

/** Recursively normalizes filter operators in the given type `T` to MongoDB operators. */
export type NormalizeFilterOperators<T> = T extends object
  ? {
      [K in keyof T as K extends Types.QueryFilterOperators
        ? `$${K & string}`
        : K]: NormalizeFilterOperators<T[K]>;
    }
  : T extends Array<infer U>
    ? Array<NormalizeFilterOperators<U>>
    : T;
