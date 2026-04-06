import type { Register, Signin } from "./auth.types.js";
import type { RequestSchemas } from "@/types/common.js";
import type { ZodType } from "zod";

import { HttpStatusCodes } from "@repo/shared";

import { errorSchema, validationErrorSchema } from "@/utils/schemas.js";

import { userSchema } from "../user/user.schemas.js";
import * as handlers from "./auth.handlers.js";

export const requestSchemas = {
  signin: {
    body: userSchema.pick({
      email: true,
      password: true,
    }) satisfies ZodType<Omit<Signin["body"], "photo">>,
    responses: {
      [HttpStatusCodes.OK]: userSchema satisfies ZodType<Signin["response"]>,
      [HttpStatusCodes.UNAUTHORIZED]: errorSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorSchema,
    },
  },

  register: {
    body: userSchema.pick({
      email: true,
      password: true,
      birthdate: true,
    }) satisfies ZodType<Register["body"]>,
    responses: {
      [HttpStatusCodes.CREATED]: userSchema,
      [HttpStatusCodes.CONFLICT]: errorSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorSchema,
    },
  },
} satisfies RequestSchemas<keyof typeof handlers>;
