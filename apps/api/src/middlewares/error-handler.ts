import type { ErrorRequestHandler } from "express";

import { HttpStatusCodes } from "@repo/shared";
import type { GeneralErrorPayload } from "@repo/types";

import { env } from "@/configs/env.js";
import { logger } from "@/lib/logger.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  try {
    logger.error(err);

    const statusCode = err.statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const error: GeneralErrorPayload = {
      message: err.message,
    };

    if (env.ENVIRONMENT !== "production") {
      error.stack = err.stack;
    }

    return res.status(statusCode).json(error);
  } catch {
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Unhandled errors" });
  }
};
