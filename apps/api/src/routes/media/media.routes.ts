import { HttpStatusCodes, HttpStatusPhrases } from "@repo/shared";

import { notFoundSchema } from "@/constants/schemas.js";
import jsonContent from "@/helpers/json-content.js";
import registerRoute from "@/helpers/register-route.js";

const tags = ["Media"];
const basePath = "/medias";

export const deleteExpiredMedias = registerRoute({
  tags,
  method: "delete",
  path: `${basePath}/expired`,
  summary: "Delete Expired Medias",
  description: "Delete all expired media files.",
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "No Content",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, HttpStatusPhrases.NOT_FOUND),
  },
});

export type DeleteExpiredMediasRoute = typeof deleteExpiredMedias;
