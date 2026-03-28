/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PopulateOptions, QuerySelector } from "mongoose";

import type {
  EmbedOptions,
  FlattenObject,
  FlattenObjectKeys,
  MapZodObjectShape,
  QueryFilter,
  Select,
  SelectValue,
  Sort,
  SortOrder,
} from "@repo/types";
import { z } from "zod";

import { enumMsg, objectIdSchema } from "./custom-validators.js";

type TypeDefinition = "string" | "number" | "boolean" | "date";

type PrimitiveSchemaReturn<Type extends TypeDefinition> = Type extends "string"
  ? z.ZodString
  : Type extends "number"
    ? z.ZodNumber
    : Type extends "boolean"
      ? z.ZodBoolean
      : Type extends "date"
        ? z.ZodUnion<[z.ZodDate, z.ZodNumber, z.ZodString]>
        : never;

const primitiveSchema = <Type extends TypeDefinition>(type: Type): PrimitiveSchemaReturn<Type> => {
  switch (type) {
    case "string":
      return z.string() as PrimitiveSchemaReturn<Type>;
    case "number":
      return z.coerce.number() as PrimitiveSchemaReturn<Type>;
    case "boolean":
      return z.coerce.boolean() as PrimitiveSchemaReturn<Type>;
    case "date":
      return z.union([
        z.coerce.date(),
        z.coerce.number(),
        z.string(),
      ]) as PrimitiveSchemaReturn<Type>;
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
};

const querySelectorSchema = (
  type: TypeDefinition,
  isArray: boolean = false,
  isObject: boolean = false
) => {
  const schema: z.ZodType<QuerySelector<any>> = z
    .object({
      $eq: primitiveSchema(type),
      $gt: primitiveSchema(type),
      $gte: primitiveSchema(type),
      $in: z.array(primitiveSchema(type)),
      $lt: primitiveSchema(type),
      $lte: primitiveSchema(type),
      $ne: primitiveSchema(type),
      $nin: z.array(primitiveSchema(type)),
      $not:
        type === "string"
          ? z.union([
              z.lazy(() => querySelectorSchema(type, isArray, isObject)),
              z.instanceof(RegExp),
            ])
          : z.lazy(() => querySelectorSchema(type, isArray, isObject)),
      $exists: primitiveSchema("boolean"),
      $type: z.union([z.string(), z.coerce.number()]),
      $expr: z.any(),
      $mod: type === "number" ? z.tuple([z.coerce.number(), z.coerce.number()]) : z.never(),
      $regex: type === "string" ? z.union([z.string(), z.instanceof(RegExp)]) : z.never(),
      $options:
        type === "string"
          ? z.enum(["i", "m", "s", "u", "x"], enumMsg(["i", "m", "s", "u", "x"]))
          : z.never(),
      $all: isArray ? z.array(primitiveSchema(type)) : z.never(),
      $elemMatch: isArray ? z.object() : z.never(),
      $size: isArray ? z.coerce.number() : z.never(),
    })
    .partial()
    .openapi({ type: "object" });
  return isObject ? (schema as z.ZodObject).pick({ $exists: true }) : schema;
};

type ExcludedKeys =
  | "_id"
  | "__v"
  | "createdAt"
  | "updatedAt"
  | "limit"
  | "page"
  | "select"
  | "sort"
  | "embed";

type SchemaDefinition<T> = {
  [P in keyof T as Exclude<P, ExcludedKeys>]?:
    | TypeDefinition
    | { type: TypeDefinition; isArray?: boolean; isObject?: boolean };
};

const projectionSchema = (keys?: string[]): z.ZodType<Select> => {
  const valueSchema = z.union([
    z.coerce.number().refine((val) => val === 1 || val === 0, enumMsg(["1", "0"])),
    z.enum(["true", "false"], enumMsg(["true", "false"])).transform((val) => val === "true"),
  ]) as z.ZodType<SelectValue>;

  return keys
    ? z.object(Object.fromEntries(keys.map((key) => [key, valueSchema]))).partial()
    : z.record(z.string(), valueSchema);
};

const sortingSchema = <Key extends string>(keys?: Key[]): z.ZodType<Sort<Key>> => {
  const orderSchema: z.ZodType<SortOrder> = z.enum(["asc", "desc"], enumMsg(["asc", "desc"]));

  return (
    keys
      ? z.union([
          z.object(Object.fromEntries(keys.map((key) => [key, orderSchema]))).partial(),
          z.array(z.tuple([z.enum(keys, enumMsg(keys)), orderSchema])),
        ])
      : z.union([z.record(z.string(), orderSchema), z.array(z.tuple([z.string(), orderSchema]))])
  ) as z.ZodType<Sort<Key>>;
};

const embedOptionsSchema = () => {
  const populateOptionsSchema: z.ZodType<EmbedOptions<Record<string, Record<string, unknown>>>> = z
    .object({
      select: projectionSchema(),
      match: z.record(
        z.string(),
        z.union([primitiveSchema("string"), querySelectorSchema("string")])
      ),
      options: z
        .object({
          projection: projectionSchema(),
          sort: sortingSchema(),
          lean: z.union([
            z.coerce.boolean(),
            z
              .object({
                versionKey: z.coerce.boolean(),
                transform: z.function({
                  input: [z.record(z.string(), z.unknown())],
                  output: z.void(),
                }),
              })
              .partial(),
          ]),
          limit: z.coerce.number(),
          includeResultMetadata: z.coerce.boolean(),
          returnOriginal: z.coerce.boolean(),
          returnDocument: z.enum(["before", "after"], enumMsg(["before", "after"])),
          skip: z.coerce.number(),
          strict: z.union([z.coerce.boolean(), z.string()]),
          strictQuery: z.union([z.coerce.boolean(), z.literal("throw")]),
          timestamps: z.union([
            z.coerce.boolean(),
            z
              .object({
                createdAt: z.coerce.boolean(),
                updatedAt: z.coerce.boolean(),
              })
              .partial(),
          ]),
        } satisfies MapZodObjectShape<PopulateOptions["options"]>)
        .partial(),
      populate: z.union([
        z.string(),
        z.array(z.string()),
        z.lazy(() => populateOptionsSchema),
        z.array(z.lazy(() => populateOptionsSchema)),
      ]) as z.ZodType<EmbedOptions<Record<string, Record<string, unknown>>>["populate"]>,
      perDocumentLimit: z.coerce.number(),
      strictPopulate: z.coerce.boolean(),
      justOne: z.coerce.boolean(),
      transform: z.function({
        input: [z.any(), z.any()],
        output: z.any(),
      }),
      localField: z.string(),
      foreignField: z.string(),
      forceRepopulate: z.coerce.boolean(),
    })
    .partial()
    .extend({
      path: z.string(),
    } satisfies MapZodObjectShape<
      Pick<EmbedOptions<Record<string, Record<string, unknown>>>, "path">
    >)
    .openapi({ type: "object" });

  return populateOptionsSchema;
};

const buildQueryFilterSchema = <T>(
  schemaDefinition: SchemaDefinition<FlattenObject<T>>,
  options?: {
    sortableFields?: FlattenObjectKeys<T>[];
    projectFields?: FlattenObjectKeys<T>[];
    embeddableFields?: FlattenObjectKeys<T>[];
  }
) => {
  const embeddableFields = options?.embeddableFields
    ? z.enum(options.embeddableFields, enumMsg(options.embeddableFields))
    : z.string();

  const baseSchema = {
    _id: z.union([objectIdSchema, querySelectorSchema("string")]),
    __v: querySelectorSchema("number"),
    createdAt: querySelectorSchema("date"),
    updatedAt: querySelectorSchema("date"),
    limit: z.coerce.number().int().gte(1),
    page: z.coerce.number().int().gte(1),
    select: projectionSchema(options?.projectFields as string[] | undefined),
    sort: sortingSchema(options?.sortableFields as string[] | undefined),
    embed: z.union([
      embeddableFields,
      z.array(embeddableFields),
      embedOptionsSchema(),
      z.array(embedOptionsSchema()),
    ]),
  } as {
    [K in keyof Required<QueryFilter<T>>]: z.ZodType<QueryFilter<T>[K]>;
  };

  for (const key in schemaDefinition) {
    const def = schemaDefinition[key];

    if (!def) continue;

    if (typeof def === "string") {
      const d = def as TypeDefinition;

      baseSchema[key as unknown as keyof typeof baseSchema] = z.union([
        primitiveSchema(d),
        querySelectorSchema(d),
      ]) as any;

      continue;
    }

    baseSchema[key as unknown as keyof typeof baseSchema] = z.union([
      def.isArray ? z.array(primitiveSchema(def.type)) : primitiveSchema(def.type),
      querySelectorSchema(def.type, def.isArray ?? false, def.isObject ?? false),
    ]) as any;
  }

  return z.object(baseSchema).partial();
};

export default buildQueryFilterSchema;
