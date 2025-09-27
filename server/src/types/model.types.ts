import type { InferSchemaType } from "mongoose";

import ImageModel from "@/routes/image/image.model";

export type Image = InferSchemaType<typeof ImageModel.schema>;
