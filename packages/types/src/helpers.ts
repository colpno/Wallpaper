type Primitive = string | number | boolean | bigint | symbol | null | undefined;

export type UnwrapArray<T> = T extends (infer U)[] | readonly (infer U)[] ? UnwrapArray<U> : T;

export type FlattenObjectKeys<T, Prefix extends string = ""> = {
  [K in keyof T & string]: UnwrapArray<Required<T>[K]> extends Primitive
    ? `${Prefix}${K}`
    : UnwrapArray<Required<T>[K]> extends Record<string, unknown>
      ? FlattenObjectKeys<UnwrapArray<Required<T>[K]>, `${Prefix}${K}.`> | `${Prefix}${K}`
      : `${Prefix}${K}`;
}[keyof T & string];

export type FlattenObjectValue<T, K extends string> = K extends `${infer Head}.${infer Tail}`
  ? Head extends keyof Required<T>
    ? FlattenObjectValue<UnwrapArray<Required<T>[Head]>, Tail>
    : never
  : K extends keyof Required<T>
    ? Required<T>[K]
    : never;

export type FlattenObject<T> = {
  [K in FlattenObjectKeys<T>]: FlattenObjectValue<T, K>;
};

/** Extracts only the known (non-index signature) keys of a type. */
export type KnownKeys<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K];
};
