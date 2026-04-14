import { HttpStatusCodes, HttpStatusPhrases } from "@repo/shared";
import { Router } from "express";

import { env } from "@/configs/env.js";
import { serveAPIDocument } from "@/lib/openapi.js";

import { authRouter } from "./auth/auth.routes.js";
import { pinRouter } from "./pin/pin.routes.js";
import { userRouter } from "./user/user.routes.js";

export const router = Router();
const routes: Router[] = [userRouter, pinRouter, authRouter];

serveAPIDocument(router, "/docs");

for (const route of routes) {
  router.use(env.ENVIRONMENT !== "test" ? env.BASE_ENDPOINT : "", route);
}

router
  .use("/favicon.ico", (_, res) => res.status(HttpStatusCodes.OK))
  .get("/", (_, res) => res.redirect("/docs"))
  .use((_, res) =>
    res.status(HttpStatusCodes.NOT_FOUND).json({ message: HttpStatusPhrases.NOT_FOUND })
  );
