import { API_ROUTES, HttpStatusCodes, HttpStatusPhrases } from "@repo/shared";

import { multer } from "@/middlewares/multer.js";
import { rateLimiter } from "@/middlewares/rate-limiter.js";
import { jsonContent, multipartContent } from "@/utils/openapi.js";
import { Router } from "@/utils/Router.js";
import { atLeastOneField, fileSchema } from "@/utils/schemas.js";

import * as handlers from "./pin.handlers.js";
import { requestSchemas } from "./pin.schemas.js";

const tags = ["Pin"];
const router = new Router();

export const { router: pinRouter } = router;

export const getMany = router.register({
  tags,
  method: "get",
  path: API_ROUTES.PIN.getMany.path(),
  summary: "Get multiple pins",
  description: "Retrieve multiple pins.",
  request: {
    query: requestSchemas.getMany.query,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      requestSchemas.getMany.responses[HttpStatusCodes.OK],
      "Successful Response"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      requestSchemas.getMany.responses[HttpStatusCodes.NOT_FOUND],
      HttpStatusPhrases.NOT_FOUND
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      requestSchemas.getMany.responses[HttpStatusCodes.UNPROCESSABLE_ENTITY],
      "Validation Error"
    ),
  },
} as const);

export const getOneById = router.register({
  tags,
  method: "get",
  path: API_ROUTES.PIN.getOneById.path("{id}"),
  summary: "Get a pin by ID",
  description: "Retrieve a pin by its ID.",
  request: {
    params: requestSchemas.getOneById.params,
    query: requestSchemas.getOneById.query,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      requestSchemas.getOneById.responses[HttpStatusCodes.OK],
      "Successful Response"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      requestSchemas.getOneById.responses[HttpStatusCodes.NOT_FOUND],
      HttpStatusPhrases.NOT_FOUND
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      requestSchemas.getOneById.responses[HttpStatusCodes.UNPROCESSABLE_ENTITY],
      "Validation Error"
    ),
  },
} as const);

export const addOne = router.register({
  tags,
  method: "post",
  path: API_ROUTES.PIN.addOne.path(),
  summary: "Add a pin",
  description: "Create a new pin.",
  request: {
    body: multipartContent(requestSchemas.addOne.body),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      requestSchemas.addOne.responses[HttpStatusCodes.CREATED],
      "Successful Response"
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

export const updateOneById = router.register({
  tags,
  method: "patch",
  path: API_ROUTES.PIN.updateOneById.path("{id}"),
  summary: "Update a pin by ID",
  description: "Update an existing pin using its unique ID.",
  request: {
    params: requestSchemas.updateOneById.params,
    body: {
      content: {
        "multipart/form-data": {
          schema: requestSchemas.updateOneById.body.refine(atLeastOneField),
        },
        "application/json": {
          schema: requestSchemas.updateOneById.body.omit({ photo: true }).refine(atLeastOneField),
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
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      requestSchemas.updateOneById.responses[HttpStatusCodes.BAD_REQUEST],
      "Bad Request"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      requestSchemas.updateOneById.responses[HttpStatusCodes.UNPROCESSABLE_ENTITY],
      "Validation Error"
    ),
  },
} as const);

export const removeOneById = router.register({
  tags,
  method: "delete",
  path: API_ROUTES.PIN.removeOneById.path("{id}"),
  summary: "Softly remove a pin by ID",
  description: "Softly remove a single pin using its unique ID.",
  request: {
    params: requestSchemas.removeOneById.params,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "No Content",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      requestSchemas.removeOneById.responses[HttpStatusCodes.NOT_FOUND],
      HttpStatusPhrases.NOT_FOUND
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      requestSchemas.removeOneById.responses[HttpStatusCodes.UNPROCESSABLE_ENTITY],
      "Validation Error"
    ),
  },
} as const);

export const removeMany = router.register({
  tags,
  method: "delete",
  path: API_ROUTES.PIN.removeMany.path(),
  summary: "Remove multiple pins",
  description: "Remove multiple pins using its unique IDs.",
  request: {
    body: jsonContent(requestSchemas.removeMany.body),
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "No Content",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      requestSchemas.removeMany.responses[HttpStatusCodes.NOT_FOUND],
      HttpStatusPhrases.NOT_FOUND
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      requestSchemas.removeMany.responses[HttpStatusCodes.UNPROCESSABLE_ENTITY],
      "Validation Error"
    ),
  },
} as const);

export const undoRemoval = router.register({
  tags,
  method: "patch",
  path: API_ROUTES.PIN.undoRemoval.path(),
  summary: "Undo removal of multiple pins",
  description: "Undo removal of multiple pins.",
  request: {
    body: jsonContent(requestSchemas.undoRemoval.body),
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "No Content",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      requestSchemas.undoRemoval.responses[HttpStatusCodes.NOT_FOUND],
      HttpStatusPhrases.NOT_FOUND
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      requestSchemas.undoRemoval.responses[HttpStatusCodes.UNPROCESSABLE_ENTITY],
      "Validation Error"
    ),
  },
} as const);

export const search = router.register({
  tags,
  method: "post",
  path: API_ROUTES.PIN.search.path(),
  summary: "Search for similar pins",
  description: "Search for similar pins using an image or text.",
  request: {
    query: requestSchemas.search.query,
    body: {
      content: {
        "application/json": {
          schema: requestSchemas.search.body,
        },
        "multipart/form-data": {
          schema: requestSchemas.search.body,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      requestSchemas.search.responses[HttpStatusCodes.OK],
      "Successful Response"
    ),
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(
      requestSchemas.search.responses[HttpStatusCodes.SERVICE_UNAVAILABLE],
      "Service Unavailable (local)"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      requestSchemas.search.responses[HttpStatusCodes.UNPROCESSABLE_ENTITY],
      "Validation Error"
    ),
  },
} as const);

router
  .addHandler(getOneById, [handlers.getOneById])
  .addHandler(getMany, [handlers.getMany])
  .addHandler(addOne, ({ validator }) => [
    multer("single", "photo")(fileSchema),
    validator,
    handlers.addOne,
  ])
  .addHandler(updateOneById, ({ validator }) => [
    multer("single", "photo")(fileSchema),
    validator,
    handlers.updateOneById,
  ])
  .addHandler(removeOneById, [handlers.removeOneById])
  .addHandler(removeMany, [handlers.removeMany])
  .addHandler(search, ({ validator }) => [
    rateLimiter({ limit: 2, windowMs: 10000 }),
    validator,
    handlers.search,
  ]);
