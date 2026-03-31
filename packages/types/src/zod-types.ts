import type { ZodOptional, ZodType } from "zod";

export type NonOptionalKeys<T> = { [k in keyof T]-?: undefined extends T[k] ? never : k }[keyof T];

export type MapZodObjectShape<T> = {
  [K in NonOptionalKeys<T>]: ZodType<T[K]>;
} & {
  [K in Exclude<keyof T, NonOptionalKeys<T>>]: ZodOptional<ZodType<T[K]>>;
};
