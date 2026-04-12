import type { RequestSchemas } from "@/types/common.js";

import { HttpStatusCodes } from "@repo/shared";

import { httpNotFoundSchema } from "@/utils/schemas.js";

import * as handlers from "./media.handlers.js";

export const requestSchemas = {
  deleteExpiredMedias: {
    responses: {
      [HttpStatusCodes.NOT_FOUND]: httpNotFoundSchema.openapi({ type: "object" }),
    },
  },
} satisfies RequestSchemas<Exclude<keyof typeof handlers, "uploadMedia" | "eraseMedia">>;
