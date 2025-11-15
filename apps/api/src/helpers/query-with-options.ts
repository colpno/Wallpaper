import type { HydratedDocument, Model, ObjectIdToString } from "mongoose";

import type { Types } from "@repo/shared";

import parseQuery from "./parse-query";

type ReturnType<M extends "find" | "findOne", T> = M extends "find"
  ? HydratedDocument<T>[]
  : HydratedDocument<T> | null;

/**
 * Executes a Mongoose query based on the provided filter.
 * @param model Mongoose model.
 * @param query A filter object.
 * @returns A promise that resolves to an array of documents matching the query.
 */
export default async function queryWithOptions<
  T extends Record<string, unknown>,
  M extends "find" | "findOne",
>(
  model: Model<T>,
  method: M,
  query: Types.ApiQuery<ObjectIdToString<T>>
): Promise<ReturnType<M, T>> {
  const options = parseQuery(query);

  let q = method === "find" ? model.find(options.filter) : model.findOne(options.filter);

  if (options.select) q = q.select(options.select);

  if (method === "find") {
    if (options.sort) q = q.sort(options.sort);
    if (options.skip) q = q.skip(options.skip);
    if (options.limit) q = q.limit(options.limit);
  }

  if (options.embed) q = q.populate(options.embed as Parameters<typeof q.populate>[0]);

  return q.exec() as Promise<ReturnType<M, T>>;
}
