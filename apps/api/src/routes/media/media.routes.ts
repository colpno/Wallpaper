import { API_ROUTES, HttpStatusCodes, HttpStatusPhrases } from "@repo/shared";

import { jsonContent } from "@/utils/openapi.js";
import { Router } from "@/utils/Router.js";

import * as handlers from "./media.handlers.js";
import { requestSchemas } from "./media.schemas.js";

const tags = ["Media"];
const router = new Router();

export const { router: mediaRouter } = router;

export const deleteExpiredMedias = router.register({
  tags,
  method: "delete",
  path: API_ROUTES.MEDIA.deleteExpiredMedias.path(),
  summary: "Delete Expired Medias",
  description: "Delete all expired media files.",
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "No Content",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      requestSchemas.deleteExpiredMedias.responses[HttpStatusCodes.NOT_FOUND],
      HttpStatusPhrases.NOT_FOUND
    ),
  },
});

router.addHandler(deleteExpiredMedias, [handlers.deleteExpiredMedias]);
