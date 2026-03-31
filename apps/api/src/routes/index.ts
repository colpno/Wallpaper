import { HttpStatusCodes, HttpStatusPhrases } from "@repo/shared";
import { Router } from "express";

import env from "@/configs/env.js";
import serveAPIDocument from "@/lib/openapi.js";

import { authRouter } from "./auth/auth.routes.js";
import { mediaRouter } from "./media/media.routes.js";
import { postRouter } from "./post/post.routes.js";
import { userRouter } from "./user/user.routes.js";

const router = Router();
const routes: Router[] = [mediaRouter, userRouter, postRouter, authRouter];

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

export default router;
