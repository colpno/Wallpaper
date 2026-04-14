import type { RouteHandler } from "@/types/route-handler.js";

import type { PinAPIs } from "@repo/types";

import * as routes from "./pin.routes.js";

export type GetMany = {
  handler: RouteHandler<typeof routes.getMany>;
} & PinAPIs.GetMany;

export type GetOneById = {
  handler: RouteHandler<typeof routes.getOneById>;
} & PinAPIs.GetOneById;

export type AddOne = {
  handler: RouteHandler<typeof routes.addOne>;
} & PinAPIs.AddOne;

export type UpdateOneById = {
  handler: RouteHandler<typeof routes.updateOneById>;
} & PinAPIs.UpdateOneById;

export type DeleteOneById = {
  handler: RouteHandler<typeof routes.deleteOneById>;
} & PinAPIs.DeleteOneById;

export type Search = {
  handler: RouteHandler<typeof routes.search>;
} & PinAPIs.Search;
