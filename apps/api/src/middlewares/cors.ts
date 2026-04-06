import main from "cors";

import { env } from "@/configs/env.js";

export const cors = main({
  origin: env.CORS_ORIGINS,
  credentials: true,
});
