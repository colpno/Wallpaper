import { API_ROUTES, HttpStatusCodes } from "@repo/shared";

import { jsonContent } from "@/utils/openapi.js";
import Router from "@/utils/Router.js";

import * as handlers from "./auth.handlers.js";
import { requestSchemas } from "./auth.schemas.js";

const tags = ["Auth"];
const router = new Router();

export const { router: authRouter } = router;

export const signin = router.register({
  tags,
  method: "post",
  path: API_ROUTES.AUTH.signin.path(),
  summary: "Signin User",
  description: "Signin a user with provided credentials.",
  request: {
    body: jsonContent(requestSchemas.signin.body),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      requestSchemas.signin.responses[HttpStatusCodes.OK],
      "Successful Response"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      requestSchemas.signin.responses[HttpStatusCodes.UNAUTHORIZED],
      "Unauthorized"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      requestSchemas.signin.responses[HttpStatusCodes.UNPROCESSABLE_ENTITY],
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

router.addHandler(signin, [handlers.signin]).addHandler(register, [handlers.register]);
