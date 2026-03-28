import { HttpStatusCodes, HttpStatusPhrases } from "@repo/shared";
import { Router } from "express";

import env from "@/configs/env.js";
import serveAPIDocument from "@/lib/openapi.js";

import mediaRouter from "./media/media.index.js";
import postRouter from "./post/post.index.js";
import userRouter from "./user/user.index.js";

const router = Router();

const routes: Router[] = [mediaRouter, userRouter, postRouter];

router.use("/favicon.ico", (_, res) => res.status(HttpStatusCodes.OK));

serveAPIDocument(router, "/docs");

for (const route of routes) {
  router.use(env.ENVIRONMENT !== "test" ? env.BASE_ENDPOINT : "", route);
}

router.use((_, res) =>
  res.status(HttpStatusCodes.NOT_FOUND).json({ message: HttpStatusPhrases.NOT_FOUND })
);

export default router;
