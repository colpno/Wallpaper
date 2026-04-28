import type { RouteHandler } from "@/types/route-handler.js";

import type { UserAPIs } from "@repo/types";

import * as routes from "./user.routes.js";

export type GetOne = {
  handler: RouteHandler<typeof routes.getOne>;
} & UserAPIs.GetOne;

export type UpdateOneById = {
  handler: RouteHandler<typeof routes.updateOneById>;
} & UserAPIs.UpdateOneById;

export type DeleteOneById = {
  handler: RouteHandler<typeof routes.deleteOneById>;
} & UserAPIs.DeleteOneById;
