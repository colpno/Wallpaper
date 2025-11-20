import type { ZodObjectShapeMap } from "@/types/common.types";
import type { User } from "@/types/model.types";

import { HttpStatusCodes, HttpStatusPhrases } from "@repo/shared";

import {
  errorSchema,
  type File,
  fileSchema,
  notFoundSchema,
  objectIdSchema,
  userSchema,
  validationErrorSchema,
} from "@/constants/schema.constants";
import jsonContent from "@/helpers/json-content";
import registerRoute from "@/helpers/register-route";
import { registry } from "@/lib/openapi";
import z, { atLeastOneFieldDefined } from "@/lib/zod";

const tags = ["User"];
const basePath = "/users";

export const signin = registerRoute({
  tags,
  method: "post",
  path: `${basePath}/signin`,
  summary: "Signin User",
  description: "Signin a user with provided credentials.",
  request: {
    body: jsonContent(
      registry.register(
        "SigninBody",
        z.object({
          email: z.email(),
          password: z.string().min(6),
        } satisfies ZodObjectShapeMap<Pick<User, "email" | "password">>)
      )
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      registry.register("SigninResponse", userSchema),
      "Successful Response"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorSchema, "Unauthorized"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(validationErrorSchema, "Validation Error"),
  },
});

export const register = registerRoute({
  tags,
  method: "post",
  path: `${basePath}/register`,
  summary: "Register User",
  description: "Create a new user.",
  request: {
    body: jsonContent(
      registry.register(
        "RegisterBody",
        z.object({
          email: z.email(),
          password: z.string().min(6),
          username: z.string().min(3).max(30),
        } satisfies ZodObjectShapeMap<Pick<User, "email" | "password" | "username">>)
      )
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      registry.register("RegisterResponse", userSchema),
      "Successful Response"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(errorSchema, "User already exists"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(validationErrorSchema, "Validation Error"),
  },
});

const updateBody = z
  .object({
    email: z.email(),
    password: z.string().min(6),
    username: z.string().min(3).max(30),
    avatar: fileSchema,
  } satisfies ZodObjectShapeMap<
    Pick<User, "email" | "password" | "username"> & {
      avatar: File;
    }
  >)
  .partial()
  .refine(atLeastOneFieldDefined, {
    message: "At least one field must be provided for update",
  });
export const updateOneById = registerRoute({
  tags,
  method: "put",
  path: `${basePath}/{id}`,
  summary: "Update an user by ID",
  description: "Update an existing user using their unique ID.",
  request: {
    params: registry.register(
      "UpdateUserByIdParams",
      z.object({
        id: objectIdSchema,
      })
    ),
    body: {
      content: {
        "multipart/form-data": {
          schema: registry.register("UpdateUserByIdBody", updateBody),
        },
        "application/json": {
          schema: updateBody.omit({ avatar: true }),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      registry.register("UpdateUserByIdResponse", userSchema),
      "Successful Response"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, HttpStatusPhrases.NOT_FOUND),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(validationErrorSchema, "Validation Error"),
  },
});

export const deleteOneById = registerRoute({
  tags,
  method: "delete",
  path: `${basePath}/{id}`,
  summary: "Delete an user by ID",
  description: "Delete a single user using their unique ID.",
  request: {
    params: registry.register(
      "DeleteUserByIdParams",
      z.object({
        id: objectIdSchema,
      })
    ),
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "No Content",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, HttpStatusPhrases.NOT_FOUND),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(validationErrorSchema, "Validation Error"),
  },
});

export type SigninRoute = typeof signin;
export type RegisterRoute = typeof register;
export type UpdateUserByIdRoute = typeof updateOneById;
export type DeleteUserByIdRoute = typeof deleteOneById;
