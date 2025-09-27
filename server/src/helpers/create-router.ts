import type { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { HttpStatusCodes } from "@wallpaper/shared";
import { type RequestHandler, Router } from "express";

import { openApiToExpressRoute } from "@/helpers";
import z from "@/lib/zod";
import type { RouteRequestKeys } from "@/types";

import createErrorObjectFromZod from "./create-error-object-from-zod";

/**
 * Middleware to validate incoming requests against the OpenAPI route configuration.
 * @param routeConfig An OpenAPI route configuration.
 * @returns An Express middleware function.
 */

export const requestValidator =
  <TConfig extends RouteConfig>(routeConfig: TConfig): RequestHandler =>
  (req, res, next) => {
    try {
      // Extract schemas from OpenAPI request route configuration
      const {
        cookies: cookiesSchema,
        headers: headersSchema,
        params: paramsSchema,
        query: querySchema,
      } = (routeConfig.request || {}) as unknown as Record<RouteRequestKeys, z.ZodType | undefined>;
      const bodySchema = routeConfig.request?.body
        ? z.union(
            Object.values(routeConfig.request.body.content).map((c) => c?.schema) as z.ZodType[]
          )
        : undefined;

      const query = querySchema?.parse(req.query);
      const params = paramsSchema?.parse(req.params);
      const body = bodySchema?.parse(req.body);
      const headers = headersSchema?.parse(req.headers);
      const cookies = cookiesSchema?.parse(req.cookies);

      req.query && Object.assign(req.query, query ?? {});
      req.params && Object.assign(req.params, params ?? {});
      req.body && Object.assign(req.body, body ?? {});
      req.headers && Object.assign(req.headers, headers ?? {});
      req.cookies && Object.assign(req.cookies, cookies ?? {});

      next();
    } catch (e) {
      const errorResponse = createErrorObjectFromZod(e as z.ZodError);
      return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json(errorResponse);
    }
  };

/**
 * Creates an Express router with ability to chain route definitions.
 * @returns An object containing the Express router and a method to define routes.
 */

export default function createRouter() {
  const router = Router();

  const api = {
    /**
     * The Express router instance.
     */

    router,

    /**
     * Defines a route with
     * validation based on the provided OpenAPI route configuration.
     * @param routeConfig An OpenAPI route configuration.
     * @param handlers One or more Express request handlers.
     * @returns A chainable object.
     */

    route<TConfig extends RouteConfig>(routeConfig: TConfig, ...handlers: RequestHandler<any>[]) {
      try {
        const path = openApiToExpressRoute(routeConfig.path, (_, paramName) => `:${paramName}`);

        router[routeConfig.method](path, requestValidator(routeConfig), ...handlers);
        return api;
      } catch (error) {
        throw error;
      }
    },
  };

  return api;
}
