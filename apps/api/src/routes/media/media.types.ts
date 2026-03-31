import type { RouteHandler } from "@/types/route-handler.js";

import type { MediaAPIs } from "@repo/types";

import * as routes from "./media.routes.js";

export type DeleteExpiredMedias = {
  handler: RouteHandler<typeof routes.deleteExpiredMedias>;
} & MediaAPIs.DeleteExpiredMedias;
