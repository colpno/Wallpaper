import type { UserKeys } from "@/types/common.js";

import { API_ROUTES, HttpStatusCodes, HttpStatusPhrases } from "@repo/shared";

import { multer } from "@/middlewares/multer.js";
import { jsonContent } from "@/utils/openapi.js";
import { Router } from "@/utils/Router.js";
import { atLeastOneField, fileSchema } from "@/utils/schemas.js";

import * as handlers from "./user.handlers.js";
import { requestSchemas } from "./user.schemas.js";

const tags = ["User"];
const router = new Router();

export const { router: userRouter } = router;

export const updateOneById = router.register({
  tags,
  method: "patch",
  path: API_ROUTES.USER.updateOneById.path("{id}"),
  summary: "Update an user by ID",
  description: "Update an existing user using their unique ID.",
  request: {
    params: requestSchemas.updateOneById.params,
    body: {
      content: {
        "multipart/form-data": {
          schema: requestSchemas.updateOneById.body.refine(atLeastOneField),
        },
        "application/json": {
          schema: requestSchemas.updateOneById.body.omit({ avatar: true }).refine(atLeastOneField),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      requestSchemas.updateOneById.responses[HttpStatusCodes.OK],
      "Successful Response"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      requestSchemas.updateOneById.responses[HttpStatusCodes.NOT_FOUND],
      HttpStatusPhrases.NOT_FOUND
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      requestSchemas.updateOneById.responses[HttpStatusCodes.UNPROCESSABLE_ENTITY],
      "Validation Error"
    ),
  },
});

export const deleteOneById = router.register({
  tags,
  method: "delete",
  path: API_ROUTES.USER.deleteOneById.path("{id}"),
  summary: "Delete an user by ID",
  description: "Delete a single user using their unique ID.",
  request: {
    params: requestSchemas.deleteOneById.params,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "No Content",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      requestSchemas.deleteOneById.responses[HttpStatusCodes.NOT_FOUND],
      HttpStatusPhrases.NOT_FOUND
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      requestSchemas.deleteOneById.responses[HttpStatusCodes.UNPROCESSABLE_ENTITY],
      "Validation Error"
    ),
  },
});

router
  .addHandler(updateOneById, ({ validator }) => [
    multer("single", "avatar" as UserKeys)(fileSchema.optional()),
    validator,
    handlers.updateOneById,
  ])
  .addHandler(deleteOneById, [handlers.deleteOneById]);
