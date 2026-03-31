import type { RouteHandler } from "@/types/route-handler.js";

import type { PostAPIs } from "@repo/types";

import * as routes from "./post.routes.js";

export type GetMany = {
  handler: RouteHandler<typeof routes.getMany>;
} & PostAPIs.GetMany;

export type GetOneById = {
  handler: RouteHandler<typeof routes.getOneById>;
} & PostAPIs.GetOneById;

export type AddOne = {
  handler: RouteHandler<typeof routes.addOne>;
} & PostAPIs.AddOne;

export type UpdateOneById = {
  handler: RouteHandler<typeof routes.updateOneById>;
} & PostAPIs.UpdateOneById;

export type RemoveOneById = {
  handler: RouteHandler<typeof routes.removeOneById>;
} & PostAPIs.RemoveOneById;

export type RemoveMany = {
  handler: RouteHandler<typeof routes.removeMany>;
} & PostAPIs.RemoveMany;

export type UndoRemoval = {
  handler: RouteHandler<typeof routes.undoRemoval>;
} & PostAPIs.UndoRemoval;

export type Search = {
  handler: RouteHandler<typeof routes.search>;
} & PostAPIs.Search;
