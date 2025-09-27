import { HttpStatusCodes } from "@wallpaper/shared";
import type { ErrorRequestHandler } from "express";

import env from "@/lib/env";
import logger from "@/lib/logger";

const errorHandler: ErrorRequestHandler = (err, _, res) => {
  logger.error(err);

  const statusCode = err.status || HttpStatusCodes.INTERNAL_SERVER_ERROR;

  const error: { message: string; stack?: string } = {
    message: err.message,
  };

  if (env.NODE_ENV !== "production") {
    error.stack = err.stack;
  }

  res.status(statusCode).json(error);
};

export default errorHandler;
