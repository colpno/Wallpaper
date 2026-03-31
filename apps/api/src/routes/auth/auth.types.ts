import type { RouteHandler } from "@/types/route-handler.js";

import type { AuthAPIs } from "@repo/types";

import * as routes from "./auth.routes.js";

export type Signin = {
  handler: RouteHandler<typeof routes.signin>;
} & AuthAPIs.Signin;

export type Register = {
  handler: RouteHandler<typeof routes.register>;
} & AuthAPIs.Register;
