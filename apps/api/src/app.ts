import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import { parse } from "qs";

import env from "./env";
import logger from "./lib/logger";
import cors from "./middlewares/cors.middleware";
import errorHandler from "./middlewares/error-handler.middleware";
import rateLimiter from "./middlewares/rate-limiter.middleware";
import router from "./routes";

export default function createApp() {
  const app = express();

  app
    .disable("x-powered-by")
    .set("query parser", (str: string) => parse(str))
    .use(rateLimiter())
    .use(cors)
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json());

  if (env.ENVIRONMENT === "development") {
    app.use(morgan("dev"));
  }

  if (env.ENVIRONMENT === "production") {
    app.use(
      morgan("tiny", {
        stream: {
          write: (message: string) => {
            logger.info(message);
          },
        },
      })
    );
  }

  app.use(router).use(errorHandler);

  return app;
}
