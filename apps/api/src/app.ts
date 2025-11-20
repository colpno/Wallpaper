import bodyParser from "body-parser";
import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { parse } from "qs";

import env from "./env";
import cors from "./middlewares/cors.middleware";

export default function createApp() {
  const app = express();

  app
    .set("query parser", (str: string) => parse(str))
    .disable("x-powered-by")
    .use(
      rateLimit({
        windowMs: env.RATE_LIMIT_TIME,
        max: env.RATE_LIMIT_MAX,
      })
    )
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(cors);

  if (env.ENVIRONMENT === "development") {
    app.use(morgan("dev"));
  }

  if (env.ENVIRONMENT === "production") {
    app.use(morgan("combined"));
  }

  return app;
}
