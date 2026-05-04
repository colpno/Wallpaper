import type { Login, Register } from "./auth.types.js";
import type { RequestSchemas } from "@/types/common.js";
import type { ZodType } from "zod";

import { HttpStatusCodes } from "@repo/shared";

import { httpErrorSchema, httpValidationErrorSchema } from "@/utils/schemas.js";

import { userSchema } from "../user/user.schemas.js";
import * as handlers from "./auth.handlers.js";

export const requestSchemas = {
  login: {
    body: userSchema.pick({
      email: true,
      password: true,
    }) satisfies ZodType<Omit<Login["body"], "photo">>,
    responses: {
      [HttpStatusCodes.OK]: userSchema.pick({
        _id: true,
        avatarUrl: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
      }) satisfies ZodType<Login["response"]>,
      [HttpStatusCodes.NOT_FOUND]: httpErrorSchema,
      [HttpStatusCodes.UNAUTHORIZED]: httpErrorSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: httpValidationErrorSchema,
    },
  },

  register: {
    body: userSchema.pick({
      username: true,
      email: true,
      password: true,
      birthdate: true,
    }) satisfies ZodType<Register["body"]>,
    responses: {
      [HttpStatusCodes.CREATED]: userSchema.pick({
        _id: true,
        avatarUrl: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
      }) satisfies ZodType<Register["response"]>,
      [HttpStatusCodes.CONFLICT]: httpErrorSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: httpValidationErrorSchema,
    },
  },
} satisfies RequestSchemas<keyof typeof handlers>;
