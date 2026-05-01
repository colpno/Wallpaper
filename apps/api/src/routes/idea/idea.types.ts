import type { RouteHandler } from "@/types/route-handler.js";

import type { IdeaAPIs } from "@repo/types";

import * as routes from "./idea.routes.js";

export type GetMany = {
  handler: RouteHandler<typeof routes.getMany>;
} & IdeaAPIs.GetMany;

export type CheckSaved = {
  handler: RouteHandler<typeof routes.checkSaved>;
} & IdeaAPIs.CheckSaved;

export type AddOne = {
  handler: RouteHandler<typeof routes.addOne>;
} & IdeaAPIs.AddOne;

export type DeleteOneById = {
  handler: RouteHandler<typeof routes.deleteOneById>;
} & IdeaAPIs.DeleteOneById;
