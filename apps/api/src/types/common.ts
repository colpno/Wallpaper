import type { Pin, User } from "@repo/types";

import { z } from "@/lib/zod.js";

export type NonOptionalKeys<T> = { [k in keyof T]-?: undefined extends T[k] ? never : k }[keyof T];

export type ZodObjectShapeMap<T> = {
  [K in NonOptionalKeys<T>]: z.ZodType<T[K]>;
} & {
  [K in Exclude<keyof T, NonOptionalKeys<T>>]?: z.ZodOptional<z.ZodType<Exclude<T[K], undefined>>>;
};

export type KnownKeys<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

export type PinKeys = keyof Pin;
export type UserKeys = keyof User;

export type RequestSchemas<K extends string> = Record<
  K,
  Partial<
    Record<"params" | "query" | "body", z.ZodType> & Record<"responses", Record<number, z.ZodType>>
  >
>;
