import { HttpStatusPhrases } from "@wallpaper/shared";

import { createMessageObjectSchema } from "~/helpers";

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);
