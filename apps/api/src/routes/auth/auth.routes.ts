import { API_ROUTES, HttpStatusCodes, HttpStatusPhrases } from "@repo/shared";

import { jsonContent } from "@/utils/openapi.js";
import { Router } from "@/utils/Router.js";

import * as handlers from "./auth.handlers.js";
import { requestSchemas } from "./auth.schemas.js";

const tags = ["Auth"];
const router = new Router();

export const { router: authRouter } = router;

export const login = router.register({
  tags,
  method: "post",
  path: API_ROUTES.AUTH.login.path(),
  summary: "Login User",
  description: "Login a user with provided credentials.",
  request: {
    body: jsonContent(requestSchemas.login.body),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      requestSchemas.login.responses[HttpStatusCodes.OK],
      "Successful Response"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      requestSchemas.login.responses[HttpStatusCodes.NOT_FOUND],
      HttpStatusPhrases.NOT_FOUND
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      requestSchemas.login.responses[HttpStatusCodes.UNAUTHORIZED],
      HttpStatusPhrases.UNAUTHORIZED
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      requestSchemas.login.responses[HttpStatusCodes.UNPROCESSABLE_ENTITY],
      "Validation Error"
    ),
  },
});

export const register = router.register({
  tags,
  method: "post",
  path: API_ROUTES.AUTH.register.path(),
  summary: "Register User",
  description: "Create a new user.",
  request: {
    body: jsonContent(requestSchemas.register.body),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      requestSchemas.register.responses[HttpStatusCodes.CREATED],
      "Successful Response"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      requestSchemas.register.responses[HttpStatusCodes.CONFLICT],
      "User already exists"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      requestSchemas.register.responses[HttpStatusCodes.UNPROCESSABLE_ENTITY],
      "Validation Error"
    ),
  },
});

router.addHandler(login, [handlers.login]).addHandler(register, [handlers.register]);
