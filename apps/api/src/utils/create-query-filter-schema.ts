import type { PopulateOptions } from "mongoose";
import type { ZodType } from "zod";

import type {
  DefaultModelProps,
  EmbedOptions,
  FilterOperators,
  FlattenObjectKeys,
  MapZodObjectShape,
  QueryFilter,
  Select,
  Sort,
  SortOrder,
} from "@repo/types";

import { z } from "@/lib/zod.js";

import { parseFilterOperators } from "./parse-filter-operators.js";
import { objectIdSchema } from "./schemas.js";

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
    const embeddableFields = options?.embeddableFields
      ? z.enum(options.embeddableFields)
      : z.string();

    return z
      .object({
        _id: createFilterOperatorsSchema(objectIdSchema),
        __v: createFilterOperatorsSchema(z.coerce.number()),
        createdAt: z.union([
          createFilterOperatorsSchema(z.coerce.date()),
          createFilterOperatorsSchema(z.string()),
        ]),
        updatedAt: z.union([
          createFilterOperatorsSchema(z.coerce.date()),
          createFilterOperatorsSchema(z.string()),
        ]),
        limit: z.coerce.number().int().gte(1),
        page: z.coerce.number().int().gte(1),
        select: createSelectSchema(options?.selectableFields),
        sort: createSortSchema(options?.sortableFields),
        embed: z.union([
          embeddableFields,
          z.array(embeddableFields),
          createEmbedOptionsSchema(),
          z.array(createEmbedOptionsSchema()),
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
      exists: z.coerce.boolean(),
      regex: z.string(),
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
    z.string(),
    z.partialRecord(
      keys ? z.enum(keys) : z.string(),
      z.union([z.coerce.number(), z.coerce.boolean()])
    ),
  ]) as z.ZodType<Select<T>>;
};

function createSortSchema<T extends string>(keys?: readonly T[]) {
  const keySchema = keys ? z.enum(keys) : z.string();
  const valueSchema = z.union([
    z.literal(1),
    z.literal(-1),
    z.literal("asc"),
    z.literal("ascending"),
    z.literal("desc"),
    z.literal("descending"),
  ]) satisfies z.ZodType<SortOrder>;

  return z.union([
    z.string(),
    z.partialRecord(keySchema, valueSchema),
    z.array(z.tuple([keySchema, valueSchema])),
  ]) as z.ZodType<Sort<T>>;
}

const createEmbedOptionsSchema = () => {
  const populateOptionsSchema: z.ZodType<EmbedOptions<Record<string, unknown>>> = z
    .object({
      select: createSelectSchema(),
      match: z.record(z.string(), createFilterOperatorsSchema(z.string())),
      options: z
        .object({
          projection: createSelectSchema(),
          sort: createSortSchema(),
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
          returnDocument: z.enum(["before", "after"]),
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
    })
    .openapi("EmbedOptions", { type: "object" });
  return populateOptionsSchema;
};
