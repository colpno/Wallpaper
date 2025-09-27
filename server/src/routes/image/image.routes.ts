import { HttpStatusCodes } from "@wallpaper/shared";

import {
  errorSchema,
  fileSchema,
  notFoundSchema,
  objectIdSchema,
} from "@/constants/schema.constants";
import {
  createMessageObjectSchema,
  createQuerySchema,
  jsonContent,
  registerRoute,
} from "@/helpers";
import { registry } from "@/lib/openapi";
import z from "@/lib/zod";
import type { Image, TSToZodObjectShape } from "@/types";

const tags = ["Image"];
const basePath = "/images";

export const getMany = registerRoute({
  tags,
  method: "get",
  path: basePath,
  summary: "Get multiple images",
  description: "Retrieve multiple images.",
  request: {
    query: registry.register(
      "GetImagesQuery",
      createQuerySchema<Image>({
        url: "string",
        publicId: "string",
        width: "number",
        height: "number",
        format: "string",
        bytes: "number",
        createdAt: "date",
        updatedAt: "date",
      })
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      registry.register(
        "GetImageResponse",
        z.array(
          z
            .object({
              url: z.url(),
              publicId: z.string(),
              width: z.number(),
              height: z.number(),
              format: z.string(),
              bytes: z.number(),
              createdAt: z.date(),
              updatedAt: z.date(),
            } satisfies TSToZodObjectShape<Image>)
            .openapi("Image")
        )
      ),
      "Successful Response"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(errorSchema, "Validation Error"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Not Found"),
  },
});

export const add = registerRoute({
  tags,
  method: "post",
  path: basePath,
  summary: "Upload multiple images",
  description: "Upload multiple images to the server.",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: registry.register(
            "AddImagesBody",
            z.object({
              images: z.array(fileSchema).min(1).max(10),
            })
          ),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(createMessageObjectSchema(), "Successful Response"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(errorSchema, "Validation Error"),
  },
});

export const updateOneById = registerRoute({
  tags,
  method: "put",
  path: `${basePath}/{id}`,
  summary: "Update an image resource by ID",
  description: "Update an existing image resource using their unique ID.",
  request: {
    params: registry.register(
      "UpdateImageByIdParams",
      z.object({
        id: objectIdSchema,
      })
    ),
    body: {
      content: {
        "multipart/form-data": {
          schema: registry.register(
            "UpdateImageByIdBody",
            z.object({
              image: fileSchema,
            })
          ),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(createMessageObjectSchema(), "Successful Response"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(errorSchema, "Validation Error"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorSchema, "Not Found"),
  },
});

export const deleteOneById = registerRoute({
  tags,
  method: "delete",
  path: `${basePath}/{id}`,
  summary: "Delete an image by ID",
  description: "Remove a single image using their unique ID.",
  request: {
    params: registry.register(
      "DeleteImageParams",
      z.object({
        id: objectIdSchema,
      })
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(createMessageObjectSchema(), "Successful Response"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(errorSchema, "Validation Error"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorSchema, "Not Found"),
  },
});

export const deleteMany = registerRoute({
  tags,
  method: "delete",
  path: basePath,
  summary: "Delete multiple images",
  description: "Remove multiple images using their unique IDs.",
  request: {
    body: jsonContent(registry.register("DeleteImagesParams", z.array(objectIdSchema).min(1))),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(createMessageObjectSchema(), "Successful Response"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(errorSchema, "Validation Error"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorSchema, "Not Found"),
  },
});

export type GetManyRoute = typeof getMany;
export type AddRoute = typeof add;
export type UpdateOneByIdRoute = typeof updateOneById;
export type DeleteOneByIdRoute = typeof deleteOneById;
export type DeleteManyRoute = typeof deleteMany;
