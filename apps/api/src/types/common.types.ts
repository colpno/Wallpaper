import z from "@/lib/zod";

export type NonOptionalKeys<T> = { [k in keyof T]-?: undefined extends T[k] ? never : k }[keyof T];

export type ZodObjectShapeMap<T> = {
  [K in NonOptionalKeys<T>]: z.ZodType<T[K]>;
} & {
  [K in Exclude<keyof T, NonOptionalKeys<T>>]?: z.ZodType<T[K]>;
};

export type KnownKeys<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};
