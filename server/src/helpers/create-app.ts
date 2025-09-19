import express from "express";
import morgan from "morgan";

import env from "~/env";
import { cors, rateLimiter } from "~/middlewares";

export default function createApp() {
  const app = express();

  // Configuration
  app.use(express.json());
  app.use(express.static("public"));

  // Middlewares
  app.use(cors);
  app.use(rateLimiter());

  if (env.NODE_ENV === "production") {
    app.use(morgan("combined"));
  }

  if (env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  return app;
}
