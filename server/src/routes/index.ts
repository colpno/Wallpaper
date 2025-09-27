import { HttpStatusCodes, HttpStatusPhrases } from "@wallpaper/shared";
import { Router } from "express";

import env from "@/lib/env";

const router = Router();

const routes: Router[] = [];

router.use("/favicon.ico", (_, res) => res.status(HttpStatusCodes.OK));

for (const route of routes) {
  router.use(env.BASE_ENDPOINT, route);
}

router.use((_, res) =>
  res.status(HttpStatusCodes.NOT_FOUND).json({ message: HttpStatusPhrases.NOT_FOUND })
);

export default router;
