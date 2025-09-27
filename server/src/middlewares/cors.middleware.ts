import main from "cors";

import env from "@/lib/env";

const cors = main({
  origin: env.CORS_ORIGINS,
  credentials: true,
});

export default cors;
