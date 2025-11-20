import type { RouteHandler, TypedRouteConfig } from "@/types";

import { HttpStatusCodes } from "@repo/shared";
import { type RequestHandler, Router } from "express";
import multer from "multer";

import { type File } from "@/constants/schema.constants";
import { openApiToExpressRoute } from "@/helpers";
import z from "@/lib/zod";

import createErrorObjectFromZod from "./create-error-object-from-zod";

/**
 * Creates file handling and validation middlewares
 * using multer and zod based on the OpenAPI body schema.
 * @param body The body schema from the OpenAPI route configuration.
 * @returns An array of Express middlewares.
 */
function fileHandling<TConfig extends TypedRouteConfig>(
  body: NonNullable<TConfig["request"]>["body"]
) {
  const bodyShape: Record<string, z.ZodType> | undefined = (
    body?.content["multipart/form-data"]?.schema as z.ZodObject | undefined
  )?.shape;

  if (!bodyShape) return [];

  const sampleImageFile: File = {
    fieldname: "test",
    originalname: "test.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",
    size: 1024,
    buffer: Buffer.from([]),
  };

  const allFileSchemasShape = Object.entries(bodyShape).filter(([, schema]) => {
    return schema.safeParse(sampleImageFile).success || schema.safeParse([sampleImageFile]).success;
  });

  if (allFileSchemasShape.length === 0) return [];

  const fileFields: multer.Field[] = allFileSchemasShape.map(([fieldName]) => ({
    name: fieldName,
  }));

  const copyReqFilesToReqBody: RequestHandler = (req, _, next) => {
    // Transform req.files to match the body schema
    const files =
      req.files && !Array.isArray(req.files)
        ? Object.entries(req.files).reduce(
            (acc, [key, value]) => {
              acc[key] = bodyShape[key].safeParse([sampleImageFile]).success ? value : value[0];
              return acc;
            },
            {} as Record<string, Express.Multer.File | Express.Multer.File[]>
          )
        : {};
    Object.assign(req.body ?? {}, files);
    next();
  };

  return [multer().fields(fileFields), copyReqFilesToReqBody];
}

/**
 * Middleware to validate incoming requests against the OpenAPI route configuration.
 * @param routeConfig An OpenAPI route configuration.
 * @returns An Express middleware function.
 */
function requestValidator(routeConfig: TypedRouteConfig): RequestHandler {
  return (req, res, next) => {
    if (!routeConfig.request) return next();

    // Extract schemas from OpenAPI request route configuration
    const {
      cookies: cookiesSchema,
      headers: headersSchema,
      params: paramsSchema,
      query: querySchema,
    } = routeConfig.request as Record<
      keyof NonNullable<TypedRouteConfig["request"]>,
      z.ZodType | undefined
    >;

    const contentType = req.header("content-type")?.split(";")[0] ?? "application/json";
    const bodyContentTypes = routeConfig.request.body?.content
      ? Object.keys(routeConfig.request.body.content)
      : [];
    if (
      routeConfig.request.body &&
      bodyContentTypes.length > 0 &&
      !bodyContentTypes.includes(contentType)
    ) {
      return res
        .status(HttpStatusCodes.UNSUPPORTED_MEDIA_TYPE)
        .json({ message: `Unsupported content type: ${contentType}` });
    }
    const bodySchema = routeConfig.request.body?.content
      ? (Object.values(routeConfig.request.body.content)[0]?.schema as z.ZodType | undefined)
      : undefined;

    const query = querySchema?.safeParse(req.query);
    const params = paramsSchema?.safeParse(req.params);
    const body = bodySchema?.safeParse(req.body);
    const headers = headersSchema?.safeParse(req.headers);
    const cookies = cookiesSchema?.safeParse(req.cookies);

    const errors = [query, params, body, headers, cookies]
      .filter((result) => result && !result.success)
      .map((result) => result!.error!);
    if (errors.length > 0) {
      return res
        .status(HttpStatusCodes.UNPROCESSABLE_ENTITY)
        .json(errors.map(createErrorObjectFromZod));
    }

    if (req.query) Object.assign(req.query, query?.data ?? {});
    if (req.params) Object.assign(req.params, params?.data ?? {});
    if (req.body) Object.assign(req.body, body?.data ?? {});
    if (req.headers) Object.assign(req.headers, headers?.data ?? {});
    if (req.cookies) Object.assign(req.cookies, cookies?.data ?? {});

    next();
  };
}

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
    route<TConfig extends TypedRouteConfig>(
      routeConfig: TConfig,
      ...handlers: (RequestHandler | RouteHandler<TConfig>)[]
    ) {
      const path = openApiToExpressRoute(routeConfig.path, (_, paramName) => `:${paramName}`);

      router[routeConfig.method](
        path,
        ...fileHandling(routeConfig.request?.body),
        requestValidator(routeConfig),
        ...(handlers as RequestHandler[])
      );
      return api;
    },
  };

  return api;
}
