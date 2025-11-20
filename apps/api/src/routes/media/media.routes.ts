import { HttpStatusCodes, HttpStatusPhrases } from "@repo/shared";

import { notFoundSchema } from "@/constants/schema.constants";
import jsonContent from "@/helpers/json-content";
import registerRoute from "@/helpers/register-route";

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
