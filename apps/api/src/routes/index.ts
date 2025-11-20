import { HttpStatusCodes, HttpStatusPhrases } from "@repo/shared";
import { Router } from "express";

import env from "@/env";
import serveAPIDocument from "@/lib/openapi";

import mediaRouter from "./media/media.index";
import userRouter from "./user/user.index";

const router = Router();

const routes: Router[] = [mediaRouter, userRouter];

router.use("/favicon.ico", (_, res) => res.status(HttpStatusCodes.OK));

serveAPIDocument(router, "/docs");

for (const route of routes) {
  router.use(env.BASE_ENDPOINT, route);
}

router.use((_, res) =>
  res.status(HttpStatusCodes.NOT_FOUND).json({ message: HttpStatusPhrases.NOT_FOUND })
);

export default router;
