import { Types } from "@wallpaper/shared";

import z from "@/lib/zod";
import type { TSToZodObjectShape } from "@/types";

const commonOperatorSchema = z.object({
  regex: z.string(),
  options: z.enum(["i", "m", "x", "s", "u"]),
  size: z.union([
    z.coerce.number(),
    z
      .object({
        eq: z.coerce.number(),
        ne: z.coerce.number(),
        gte: z.coerce.number(),
        gt: z.coerce.number(),
        lte: z.coerce.number(),
        lt: z.coerce.number(),
      })
      .partial(),
  ]),
  exists: z.coerce.boolean(),
} satisfies TSToZodObjectShape<Partial<Types.FilterOperatorsObject<string>>> &
  Partial<TSToZodObjectShape<Types.FilterOperatorsObject<any[]>>>);

const stringSchemaShape = {
  eq: z.string(),
  ne: z.string(),
  gt: z.string(),
  gte: z.string(),
  lt: z.string(),
  lte: z.string(),
  all: z.array(z.string()),
  in: z.array(z.string()),
  nin: z.array(z.string()),
} satisfies TSToZodObjectShape<Types.FilterOperatorsObject<string>>;

const stringSchema = z.union([
  commonOperatorSchema
    .pick({
      regex: true,
      options: true,
      exists: true,
      size: true,
    })
    .extend(stringSchemaShape)
    .partial(),
  z.string(),
]);

const numberSchemaShape = {
  eq: z.coerce.number(),
  ne: z.coerce.number(),
  gt: z.coerce.number(),
  gte: z.coerce.number(),
  lt: z.coerce.number(),
  lte: z.coerce.number(),
  all: z.array(z.coerce.number()),
  in: z.array(z.coerce.number()),
  nin: z.array(z.coerce.number()),
} satisfies TSToZodObjectShape<Types.FilterOperatorsObject<number>>;

const numberSchema = z.union([
  commonOperatorSchema
    .pick({
      exists: true,
      size: true,
    })
    .extend(numberSchemaShape)
    .partial(),
  z.coerce.number(),
]);

const booleanSchemaShape = {
  eq: z.coerce.boolean(),
  ne: z.coerce.boolean(),
} satisfies TSToZodObjectShape<Types.FilterOperatorsObject<boolean>>;

const booleanSchema = z.union([
  commonOperatorSchema
    .pick({
      exists: true,
      size: true,
    })
    .extend(booleanSchemaShape)
    .partial(),
  z.coerce.boolean(),
]);

const dateSchemaShape = {
  eq: z.coerce.date(),
  ne: z.coerce.date(),
  gt: z.coerce.date(),
  gte: z.coerce.date(),
  lt: z.coerce.date(),
  lte: z.coerce.date(),
  all: z.array(z.coerce.date()),
  in: z.array(z.coerce.date()),
  nin: z.array(z.coerce.date()),
} satisfies TSToZodObjectShape<Types.FilterOperatorsObject<Date>>;

const dateSchema = z.union([
  commonOperatorSchema
    .pick({
      exists: true,
      size: true,
    })
    .extend(dateSchemaShape)
    .partial(),
  z.coerce.date(),
  numberSchema,
  stringSchema,
]);

const schemas = {
  string: stringSchema,
  number: numberSchema,
  boolean: booleanSchema,
  date: dateSchema,
} as const;

type SchemaMap = typeof schemas;
type SchemaKey = keyof SchemaMap;

type ValueMap<T> = T extends string
  ? Extract<SchemaKey, "string">
  : T extends number
    ? Extract<SchemaKey, "number">
    : T extends boolean
      ? Extract<SchemaKey, "boolean">
      : T extends Date | NativeDate
        ? Extract<SchemaKey, "date">
        : never;

type NoNullValue<T extends object> = {
  [K in keyof T as T[K] extends never | undefined ? never : K]: T[K];
};

type Input<TObject extends Record<string, unknown>, TDepth extends number> =
  TObject extends Record<string, SchemaKey>
    ? TObject
    : NoNullValue<{
        [K in
          | Types.FlattenObjectKeys<TObject, TDepth>
          | (keyof TObject & string)]?: Types.FlattenedObjectKeysValue<
          TObject,
          K,
          TDepth
        > extends infer U
          ? U extends Array<infer I>
            ? ValueMap<I>
            : ValueMap<U>
          : never;
      }>;

type Shape<TObject extends Record<string, unknown>, TDepth extends number> =
  TObject extends Record<string, SchemaKey>
    ? {
        [K in keyof TObject]: SchemaMap[ValueMap<TObject[K]>];
      }
    : NoNullValue<{
        [K in
          | Types.FlattenObjectKeys<TObject, TDepth>
          | (keyof TObject & string)]: SchemaMap[ValueMap<
          Types.FlattenedObjectKeysValue<TObject, K, TDepth>
        >];
      }>;

/**
 * Flattens a nested object into a single level object with `delimiter` notation keys (similar to MongoDB).
 * @param object The object to flatten.
 * @param prefix The prefix to use for the keys.
 * @param delimiter The delimiter to use between nested keys.
 * @default "."
 * @returns The flattened object.
 */

function flattenObject<O extends Record<string, unknown>>(
  object: O,
  prefix: string = "",
  delimiter: string = "."
) {
  return Object.keys(object).reduce(
    (acc, key) => {
      const pre = prefix.length ? prefix + delimiter : "";
      if (Array.isArray(object[key])) {
        // Skip array indexes to items
        Object.assign(acc, ...object[key].map((item) => flattenObject(item, pre + key)));
      } else if (typeof object[key] === "object" && object[key] !== null) {
        Object.assign(acc, flattenObject(object[key] as Record<string, unknown>, pre + key));
      } else {
        acc[pre + key] = object[key];
      }
      return acc;
    },
    {} as Record<string, unknown>
  ) as {
    [K in Types.FlattenObjectKeys<O, 5>]: Types.FlattenedObjectKeysValue<O, K, 5>;
  };
}

/**
 * Creates a Zod schema for filtering based on the provided input.
 * @param input An object defining the fields and their types for filtering.
 * @returns A Zod schema for filtering based on the provided input.
 */

export default function createQuerySchema<
  TObject extends Record<string, unknown> = Record<string, SchemaKey>,
  TDepth extends number = 5,
>(input: Input<TObject & { _id: "string" }, TDepth>) {
  type ShapeKey = keyof Shape<TObject, TDepth>;
  type ShapeValue = Shape<TObject, TDepth>[ShapeKey];

  const shape = Object.entries(flattenObject(input)).reduce(
    (acc, [key, value]) => {
      acc[key as ShapeKey] = schemas[value as SchemaKey] as ShapeValue;
      return acc;
    },
    {} as Shape<TObject, TDepth>
  );

  return z
    .object({
      ...shape,
      not: z.object(shape).partial(),
      or: z.array(z.object(shape).partial()),
      and: z.array(z.object(shape).partial()),
      nor: z.array(z.object(shape).partial()),
    })
    .partial();
}
