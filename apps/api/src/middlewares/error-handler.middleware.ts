import type { Error } from "@/constants/schema.constants";
import type { ErrorRequestHandler } from "express";

import { HttpStatusCodes } from "@repo/shared";

import env from "@/env";
import logger from "@/lib/logger";

const errorHandler: ErrorRequestHandler = (err, _, res) => {
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
