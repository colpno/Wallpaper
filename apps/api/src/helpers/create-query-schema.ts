import type { ZodObjectShapeMap } from "@/types";

import { Types } from "@repo/shared";

import { objectIdSchema } from "@/constants/schema.constants";
import z from "@/lib/zod";

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
} satisfies ZodObjectShapeMap<Partial<Types.FilterOperatorsObject<string>>> &
  Partial<ZodObjectShapeMap<Types.FilterOperatorsObject<unknown[]>>>);

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
} satisfies ZodObjectShapeMap<Types.FilterOperatorsObject<string>>;

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
} satisfies ZodObjectShapeMap<Types.FilterOperatorsObject<number>>;

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
} satisfies ZodObjectShapeMap<Types.FilterOperatorsObject<boolean>>;

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
} satisfies ZodObjectShapeMap<Types.FilterOperatorsObject<Date>>;

const dateSchema = z.union([
  commonOperatorSchema
    .pick({
      exists: true,
      size: true,
    })
    .extend(dateSchemaShape)
    .partial(),
  z.coerce.date(),
]);

const generateArraySchema = <T>(schema: z.ZodType<T>) => {
  return z.union([
    commonOperatorSchema
      .pick({
        exists: true,
        size: true,
      })
      .extend({
        eq: z.array(schema),
        ne: z.array(schema),
        all: z.array(schema),
        in: z.array(schema),
        nin: z.array(schema),
      } satisfies Partial<Record<keyof Types.FilterOperatorsObject<unknown>, z.ZodType>>)
      .partial(),
    schema.array(),
  ]);
};

const schemas = {
  string: stringSchema,
  number: numberSchema,
  boolean: booleanSchema,
  date: dateSchema,
  array: {
    string: generateArraySchema(z.string()),
    number: generateArraySchema(z.coerce.number()),
    boolean: generateArraySchema(z.coerce.boolean()),
    date: generateArraySchema(z.coerce.date()),
  },
} as const;

const embedSchema: z.ZodType<Types.EmbedOptions<Record<string, Record<string, unknown>>>> =
  z.object({
    path: z.string(),
    options: z
      .object({
        limit: z.coerce.number().optional(),
        page: z.coerce.number().optional(),
        sort: z.record(z.string(), z.enum(["asc", "desc"])).optional(),
      })
      .optional(),
    justOne: z.coerce.boolean().optional(),
    ordered: z.coerce.boolean().optional(),
    select: z.array(z.string()).optional(),
    match: z
      .record(z.string(), z.union([stringSchema, numberSchema, booleanSchema, dateSchema]))
      .optional(),
    populate: z
      .union([
        z.string(),
        z.array(z.string()),
        z.lazy(() => embedSchema),
        z.array(z.lazy(() => embedSchema)),
      ])
      .optional()
      .openapi({ type: "string" }),
  });

/**
 * Creates a Zod schema for filtering based on the provided input.
 * @param input An object defining the fields and their types for filtering.
 * @returns A Zod schema for filtering based on the provided input.
 */
export default function createQuerySchema<
  TObject extends z.ZodRawShape | Record<string, unknown>,
  TDepth extends number = 5,
>(
  callback: (
    schema: typeof schemas & { commonOperators: typeof commonOperatorSchema }
  ) => TObject extends z.ZodRawShape
    ? TObject
    : {
        [K in Types.FlattenObjectKeys<TObject, TDepth>]?: z.ZodType<
          | Types.FlattenedObjectKeysValue<TObject, K, TDepth>
          | Types.FilterOperatorsObject<Types.FlattenedObjectKeysValue<TObject, K, TDepth>>
        >;
      }
) {
  const shape = callback({
    ...schemas,
    commonOperators: commonOperatorSchema,
  }) as unknown as Required<{
    [K in keyof TObject]: z.ZodType<TObject[K] | Types.FilterOperatorsObject<TObject[K]>>;
  }>;

  return z
    .object({
      _id: objectIdSchema,
      not: z.object(shape).partial().openapi({ description: "Negates the filter conditions." }),
      or: z
        .array(z.object(shape).partial())
        .openapi({ description: "At least one condition must be met." }),
      and: z
        .array(z.object(shape).partial())
        .openapi({ description: "All conditions must be met." }),
      nor: z
        .array(z.object(shape).partial())
        .openapi({ description: "None of the conditions must be met." }),
      embed: (
        z.union([
          z.enum(Object.keys(shape)),
          z.enum(Object.keys(shape)).array(),
          embedSchema,
          z.array(embedSchema),
        ]) as z.ZodType<Types.ApiQuery<TObject>["embed"]>
      ).openapi({ description: "Fields to populate with related documents." }),
      sort: (
        z.partialRecord(z.enum(Object.keys(shape)), z.enum(["asc", "desc"])) as z.ZodType<
          Types.ApiQuery<TObject>["sort"]
        >
      ).openapi({ description: "Fields to sort by." }),
      select: (
        z.array(
          z.enum([...Object.keys(shape), "_id", "__v"].flatMap((key) => [key, `-${key}`]))
        ) as z.ZodType<Types.ApiQuery<TObject>["select"]>
      ).openapi({ description: "Fields to include or exclude." }),
      limit: z.coerce.number().min(1).max(100).default(10).openapi({
        default: 10,
        description: "Number of items to return per page, maximum is 100.",
      }),
      page: z.coerce
        .number()
        .min(1)
        .default(1)
        .openapi({ default: 1, description: "Current page number." }),
      ...shape,
    })
    .partial();
}
