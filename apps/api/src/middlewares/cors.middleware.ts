import main from "cors";

import env from "@/configs/env.js";

const cors = main({
  origin: env.CORS_ORIGINS,
  credentials: true,
});

export default cors;
