import type { RouteHandler } from "@/types/route-handler.js";

import type { AuthAPIs } from "@repo/types";

import * as routes from "./auth.routes.js";

export type Login = {
  handler: RouteHandler<typeof routes.login>;
} & AuthAPIs.Login;

export type Register = {
  handler: RouteHandler<typeof routes.register>;
} & AuthAPIs.Register;
