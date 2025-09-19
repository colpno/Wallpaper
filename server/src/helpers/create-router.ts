import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { HttpStatusCodes } from "@wallpaper/shared";
import { Router } from "express";

import z from "~/configs/zod.config";
import { RequestKeys, RouteHandler } from "~/types";
import { ErrorType } from "./create-error-schema";
import openAPIToRoutePath from "./open-api-to-route-path";

const requestValidator =
  <TConfig extends RouteConfig>(routeConfig: TConfig): RouteHandler<TConfig> =>
  (req, res, next) => {
    // Helper function to construct error object from Zod parse result
    const constructErrorObject = <T extends unknown>(parseResult?: z.ZodSafeParseResult<T>) => {
      if (!parseResult) return null;
      if (parseResult.success) return parseResult;
      const { error } = parseResult;
      const errorObj: ErrorType = {
        success: false,
        error: {
          name: error.name,
          issues: error.issues.map((issue) => ({
            code: issue.code,
            path: issue.path.filter((p) => typeof p !== "symbol"),
            message: issue.message,
          })),
        },
      };
      return errorObj;
    };

    const {
      cookies: cookiesSchema,
      headers: headersSchema,
      params: paramsSchema,
      query: querySchema,
    } = (routeConfig.request || {}) as unknown as Record<RequestKeys, z.ZodType | undefined>;
    const bodySchema = routeConfig.request?.body?.content["application/json"]?.schema as z.ZodType;

    const queryResult = querySchema?.safeParse(req.query);
    const paramsResult = paramsSchema?.safeParse(req.params);
    const bodyResult = bodySchema?.safeParse(req.body);
    const headersResult = headersSchema?.safeParse(req.headers);
    const cookiesResult = cookiesSchema?.safeParse(req.cookies);

    const errors = [queryResult, paramsResult, bodyResult, headersResult, cookiesResult]
      .filter((result) => result && "error" in result)
      .map(constructErrorObject) as ErrorType[];

    if (errors.length > 0) {
      return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json(errors[0] as any);
    }

    req.query && Object.assign(req.query, queryResult?.data ?? {});
    req.params && Object.assign(req.params, paramsResult?.data ?? {});
    req.body && Object.assign(req.body, bodyResult?.data ?? {});
    req.headers && Object.assign(req.headers, headersResult?.data ?? {});
    req.cookies && Object.assign(req.cookies, cookiesResult?.data ?? {});

    next();
  };

export default function createRouter() {
  const router = Router();

  const api = {
    router,
    route<TConfig extends RouteConfig>(routeConfig: TConfig, ...handler: RouteHandler<TConfig>[]) {
      const path = openAPIToRoutePath(routeConfig.path, (_, paramName) => `:${paramName}`);
      router[routeConfig.method](path, requestValidator(routeConfig), ...handler);
      return api;
    },
  };

  return api;
}
