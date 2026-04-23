import type { ZodType } from "zod";

import type {
  DefaultModelProps,
  EmbedOptions,
  FilterOperators,
  FlattenObjectKeys,
  QueryFilter,
  Select,
  Sort,
  SortOrder,
} from "@repo/types";

import { z } from "@/lib/zod.js";

import { parseFilterOperators } from "./parse-filter-operators.js";
import {
  booleanFromStringSchema,
  isoFromDateStringSchema,
  objectIdSchema,
  stringSchema,
} from "./schemas.js";

export const createQueryFilterSchema = <T extends Record<string, unknown>>() => {
  return <
    TSortable extends FlattenObjectKeys<T>,
    TSelectable extends FlattenObjectKeys<T>,
    TEmbeddable extends FlattenObjectKeys<T>,
    TDefinition extends Partial<Record<string, ZodType>> = Partial<
      Record<
        Exclude<FlattenObjectKeys<T>, keyof DefaultModelProps | keyof QueryFilter<unknown>>,
        ZodType
      >
    >,
  >(
    schemaDefinition: TDefinition,
    options?: {
      sortableFields?: TSortable[];
      selectableFields?: TSelectable[];
      embeddableFields?: TEmbeddable[];
    }
  ) => {
    const embeddableFields = (
      options?.embeddableFields ? z.enum(options.embeddableFields) : stringSchema
    ) as ZodType<TEmbeddable>;

    return z
      .object({
        _id: createFilterOperatorsSchema(objectIdSchema),
        __v: createFilterOperatorsSchema(z.coerce.number()),
        createdAt: createFilterOperatorsSchema(isoFromDateStringSchema),
        updatedAt: createFilterOperatorsSchema(isoFromDateStringSchema),
        limit: z.coerce.number().int().gte(1),
        page: z.coerce.number().int().gte(1),
        select: createSelectSchema(options?.selectableFields),
        sort: createSortSchema(options?.sortableFields),
        embed: z.union([
          embeddableFields,
          createEmbedOptionsSchema<TEmbeddable>(embeddableFields),
          z.array(
            z.union([embeddableFields, createEmbedOptionsSchema<TEmbeddable>(embeddableFields)])
          ),
        ]),
      })
      .extend(
        Object.fromEntries(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Object.entries<ZodType>(schemaDefinition as any).map(([key, schema]) => [
            key,
            createFilterOperatorsSchema(schema),
          ])
        ) as {
          [K in keyof TDefinition]: ReturnType<
            typeof createFilterOperatorsSchema<NonNullable<TDefinition[K]>>
          >;
        }
      )
      .partial();
  };
};

const createFilterOperatorsSchema = <TSchema extends ZodType>(base: TSchema) => {
  type T = z.infer<TSchema>;

  const regexOptions: NonNullable<FilterOperators<unknown>["options"]>[] = [
    "i",
    "m",
    "x",
    "s",
    "u",
  ];

  const schema = z
    .object({
      eq: base,
      ne: base,
      gt: base,
      gte: base,
      lt: base,
      lte: base,
      all: z.array(base),
      in: z.array(base),
      nin: z.array(base),
      exists: booleanFromStringSchema,
      regex: stringSchema,
      options: z.enum(regexOptions),
      size: z.union([
        z.coerce.number(),
        z
          .object({
            eq: z.coerce.number(),
            ne: z.coerce.number(),
            gt: z.coerce.number(),
            gte: z.coerce.number(),
            lt: z.coerce.number(),
            lte: z.coerce.number(),
          })
          .partial(),
      ]),
    })
    .partial() satisfies z.ZodType<FilterOperators<T>>;

  return z.union([schema.transform(parseFilterOperators), base]);
};

const createSelectSchema = <T extends string>(keys?: T[]) => {
  return z.union([
    stringSchema,
    z.partialRecord(
      keys ? z.enum(keys) : stringSchema,
      z.union([z.coerce.number(), booleanFromStringSchema])
    ),
  ]) as z.ZodType<Select<T>>;
};

function createSortSchema<T extends string>(keys?: readonly T[]) {
  const keySchema = keys ? z.enum(keys) : stringSchema;
  const valueSchema = z.union([
    z.literal(1),
    z.literal(-1),
    z.literal("asc"),
    z.literal("ascending"),
    z.literal("desc"),
    z.literal("descending"),
  ]) satisfies z.ZodType<SortOrder>;

  return z.union([
    stringSchema,
    z.partialRecord(keySchema, valueSchema),
    z.array(z.tuple([keySchema, valueSchema])),
  ]) as z.ZodType<Sort<T>>;
}

const createEmbedOptionsSchema = <T extends string>(pathSchema: ZodType<T>) => {
  const populateOptionsSchema: z.ZodType<EmbedOptions<Record<T, unknown>>> = z
    .object({
      select: createSelectSchema(),
      match: z.record(stringSchema, createFilterOperatorsSchema(stringSchema)),
      options: z
        .object({
          sort: createSortSchema(),
        })
        .partial(),
      populate: z.union([
        stringSchema,
        z.array(stringSchema),
        z.lazy(() => populateOptionsSchema),
        z.array(z.lazy(() => populateOptionsSchema)),
      ]),
    })
    .partial()
    .extend({
      path: pathSchema,
    })
    .openapi("EmbedOptions", { type: "object" });
  return populateOptionsSchema;
};
