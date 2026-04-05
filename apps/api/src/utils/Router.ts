import type { RequestContentType, RouteConfig, RouteHandler } from "@/types/route-handler.js";

import { HttpStatusCodes } from "@repo/shared";
import { type Request, type RequestHandler, type Response, Router as ExpressRouter } from "express";

import { registry } from "@/lib/openapi.js";

import { createErrorObjectFromZod, openApiToExpressPath } from "./converters.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handlers<T extends RouteConfig> = RequestHandler<any, any, any, any> | RouteHandler<T>;

type BuiltInMiddlewares<T extends RouteConfig> = {
  validator: Handlers<T>;
};

export default class Router {
  private routeConfigs: RouteConfig[] = [];
  private _router = ExpressRouter();

  public get router() {
    return this._router;
  }

  public register<T extends RouteConfig>(config: T) {
    registry.registerPath(config);
    this.routeConfigs.push(config);
    return config;
  }

  public addHandler<T extends RouteConfig>(
    config: T,
    handlers: Handlers<T>[] | ((builtIn: BuiltInMiddlewares<T>) => Handlers<T>[])
  ): this {
    const { method, path: configPath } = config;
    const path = openApiToExpressPath(configPath, (_, paramName) => `:${paramName}`);

    this._router[method](
      path,
      ...((typeof handlers === "function"
        ? handlers({
            validator: this.validateRequestInputs(config),
          })
        : [this.validateRequestInputs(config), ...(handlers ?? [])]) as RequestHandler[])
    );

    return this;
  }

  /**
   * Middleware to validate incoming requests.
   * @param routeConfig An OpenAPI route configuration.
   * @returns An Express middleware function.
   */
  private validateRequestInputs(routeConfig: RouteConfig): RequestHandler {
    return (req, res, next) => {
      try {
        if (!routeConfig.request) return next();

        // Check valid content type of request body
        const { body: bodyConfig } = routeConfig.request;
        const validContentTypes = (
          bodyConfig?.content ? Object.keys(bodyConfig.content) : []
        ) as RequestContentType[];
        const reqContentType = (req.header("content-type")?.split(";")[0] ??
          "application/json") as RequestContentType;

        if (
          bodyConfig &&
          validContentTypes.length > 0 &&
          validContentTypes.every((validType) => reqContentType !== validType)
        ) {
          return res.status(HttpStatusCodes.UNSUPPORTED_MEDIA_TYPE).json({
            message: `Unsupported media type, valid types are: ${validContentTypes.join(", ")}`,
          });
        }

        // Extract schemas from route configuration
        const {
          query: querySchema,
          params: paramsSchema,
          headers: headersSchema,
          cookies: cookiesSchema,
        } = routeConfig.request;
        const bodySchema = bodyConfig?.content?.[reqContentType]?.schema;

        // Validate inputs
        const parsedResult = {
          query: querySchema?.safeParse(req.query),
          params: paramsSchema?.safeParse(req.params),
          body: bodySchema?.safeParse(req.body),
          headers: Array.isArray(headersSchema)
            ? headersSchema.map((schema) => schema.safeParse(req.headers))
            : [headersSchema?.safeParse(req.headers)],
          cookies: cookiesSchema?.safeParse(req.cookies),
        };
        const errorResults = [
          parsedResult.query,
          parsedResult.params,
          parsedResult.body,
          ...parsedResult.headers,
          parsedResult.cookies,
        ]
          .filter((result) => result && !result.success)
          .map((result) => result!.error!);

        if (errorResults.length > 0) {
          return res
            .status(HttpStatusCodes.UNPROCESSABLE_ENTITY)
            .json(errorResults.map(createErrorObjectFromZod));
        }

        // Override req object
        const overrideReq = (inputType: keyof typeof req, value?: unknown) => {
          if (!value) return;
          this.overrideExpressApiObject(req, inputType, value);
        };

        if (req.query) {
          overrideReq("query", parsedResult.query?.data);
        }

        if (req.params) {
          overrideReq("params", parsedResult.params?.data);
        }
        if (req.body) {
          overrideReq("body", parsedResult.body?.data);
        }

        if (req.headers) {
          overrideReq(
            "headers",
            Object.assign(
              {},
              parsedResult.headers.map((r) => r?.data)
            )
          );
        }

        if (req.cookies) {
          overrideReq("cookies", parsedResult.cookies?.data);
        }

        return next();
      } catch (error) {
        return next(error);
      }
    };
  }

  private overrideExpressApiObject<T extends Response | Request>(
    api: T,
    method: keyof T,
    value: unknown
  ) {
    return Object.defineProperty(api, method, {
      ...Object.getOwnPropertyDescriptor(api, method),
      value,
      writable: true,
    });
  }
}
