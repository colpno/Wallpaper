import type { Register, Signin } from "./auth.types.js";
import type { RequestSchemas, ZodObjectShapeMap } from "@/types/common.js";
import type { ZodType } from "zod";

import { HttpStatusCodes } from "@repo/shared";

import z from "@/lib/zod.js";
import { atLeastOneField, errorSchema, validationErrorSchema } from "@/utils/schemas.js";

import { userSchema } from "../user/user.schemas.js";
import * as handlers from "./auth.handlers.js";

export const requestSchemas = {
  signin: {
    body: z
      .object({
        email: z.email(),
        password: z.string().min(6),
      } satisfies ZodObjectShapeMap<Omit<Signin["body"], "photo">>)
      .refine(atLeastOneField),
    responses: {
      [HttpStatusCodes.OK]: userSchema satisfies ZodType<Signin["response"]>,
      [HttpStatusCodes.UNAUTHORIZED]: errorSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorSchema,
    },
  },

  register: {
    body: z.object({
      email: z.email(),
      password: z.string().min(6),
      username: z.string().min(3).max(30),
    }) satisfies ZodType<Register["body"]>,
    responses: {
      [HttpStatusCodes.CREATED]: userSchema,
      [HttpStatusCodes.CONFLICT]: errorSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorSchema,
    },
  },
} satisfies RequestSchemas<keyof typeof handlers>;
