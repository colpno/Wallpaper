import bodyParser from "body-parser";
import express from "express";
import { parse } from "qs";

import { env } from "@/configs/env.js";
import { cors } from "@/middlewares/cors.js";
import { errorHandler } from "@/middlewares/error-handler.js";
import { morgan } from "@/middlewares/morgan.js";
import { rateLimiter } from "@/middlewares/rate-limiter.js";
import { router } from "@/routes/index.js";

export const configureApp = (app: express.Express) => {
  app
    .set("query parser", (str: string) => parse(str))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json());

  if (env.ENVIRONMENT !== "test") {
    app.use(cors).use(rateLimiter()).use(morgan);
  }

  app.use(router).use(errorHandler);
};
