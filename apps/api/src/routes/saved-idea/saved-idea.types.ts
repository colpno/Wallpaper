import type { RouteHandler } from "@/types/route-handler.js";

import type { SavedIdeaAPIs } from "@repo/types";

import * as routes from "./saved-idea.routes.js";

export type GetMany = {
  handler: RouteHandler<typeof routes.getMany>;
} & SavedIdeaAPIs.GetMany;

export type CheckSaved = {
  handler: RouteHandler<typeof routes.checkSaved>;
} & SavedIdeaAPIs.CheckSaved;

export type AddOne = {
  handler: RouteHandler<typeof routes.addOne>;
} & SavedIdeaAPIs.AddOne;

export type DeleteOneById = {
  handler: RouteHandler<typeof routes.deleteOneById>;
} & SavedIdeaAPIs.DeleteOneById;
