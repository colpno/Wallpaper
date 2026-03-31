import type { Error } from "@/utils/schemas.js";
import type { ErrorRequestHandler } from "express";

import { HttpStatusCodes } from "@repo/shared";

import env from "@/configs/env.js";
import logger from "@/lib/logger.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error(err);

  const statusCode = err.statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR;
  const error: Error = {
    message: err.message,
  };

  if (env.ENVIRONMENT !== "production") {
    error.stack = err.stack;
  }

  res.status(statusCode).json(error);
};

export default errorHandler;
