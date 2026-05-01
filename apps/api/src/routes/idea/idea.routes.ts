import { API_ROUTES, HttpStatusCodes, HttpStatusPhrases } from "@repo/shared";

import { jsonContent } from "@/utils/openapi.js";
import { Router } from "@/utils/Router.js";

import * as handlers from "./idea.handlers.js";
import { requestSchemas } from "./idea.schemas.js";

const tags = ["Idea"];
const router = new Router();

export const { router: ideaRouter } = router;

export const getMany = router.register({
  tags,
  method: "get",
  path: API_ROUTES.IDEA.getMany.path(),
  summary: "Get multiple ideas",
  description: "Retrieve multiple ideas.",
  request: {
    query: requestSchemas.getMany.query,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      requestSchemas.getMany.responses[HttpStatusCodes.OK],
      "Successful Response"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      requestSchemas.getMany.responses[HttpStatusCodes.UNPROCESSABLE_ENTITY],
      "Validation Error"
    ),
  },
} as const);

export const checkSaved = router.register({
  tags,
  method: "get",
  path: API_ROUTES.IDEA.checkSaved.path(),
  summary: "Is pin saved?",
  description: "Check if a pin is saved.",
  request: {
    query: requestSchemas.checkSaved.query,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      requestSchemas.checkSaved.responses[HttpStatusCodes.OK],
      "Successful Response"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      requestSchemas.checkSaved.responses[HttpStatusCodes.NOT_FOUND],
      HttpStatusPhrases.NOT_FOUND
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      requestSchemas.checkSaved.responses[HttpStatusCodes.UNPROCESSABLE_ENTITY],
      "Validation Error"
    ),
  },
} as const);

export const addOne = router.register({
  tags,
  method: "post",
  path: API_ROUTES.IDEA.addOne.path(),
  summary: "Save an idea.",
  description: "Create a new idea.",
  request: {
    body: jsonContent(requestSchemas.addOne.body),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      requestSchemas.addOne.responses[HttpStatusCodes.CREATED],
      "Successful Response (resource was updated)"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      requestSchemas.addOne.responses[HttpStatusCodes.CONFLICT],
      "Conflict Error"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      requestSchemas.addOne.responses[HttpStatusCodes.BAD_REQUEST],
      "Bad Request"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      requestSchemas.addOne.responses[HttpStatusCodes.UNPROCESSABLE_ENTITY],
      "Validation Error"
    ),
  },
} as const);

export const deleteOneById = router.register({
  tags,
  method: "delete",
  path: API_ROUTES.IDEA.deleteOneById.path("{id}"),
  summary: "Delete an idea by ID",
  description: "Delete a single idea using its unique ID.",
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
} as const);

router
  .addHandler(checkSaved, [handlers.checkSaved])
  .addHandler(getMany, [handlers.getMany])
  .addHandler(addOne, [handlers.addOne])
  .addHandler(deleteOneById, [handlers.deleteOneById]);
