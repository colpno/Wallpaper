import type { Error } from "@/constants/schemas.js";
import type { ErrorRequestHandler } from "express";

import { HttpStatusCodes } from "@repo/shared";

import env from "@/configs/env.js";
import logger from "@/lib/logger.js";

const errorHandler: ErrorRequestHandler = (err, _req, res) => {
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
