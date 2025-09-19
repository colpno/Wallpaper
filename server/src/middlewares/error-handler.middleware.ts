import { HttpStatusCodes } from "@wallpaper/shared";

import env from "~/env";
import logger from "~/lib/logger";

import type { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, _, res) => {
  logger.error(err);

  const statusCode = err.status || HttpStatusCodes.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    message: err.message,
    stack: env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export default errorHandler;
