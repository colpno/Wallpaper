import { createLogger } from "@repo/logger";

import env from "@/configs/env.js";

const logger = createLogger({
  enabled: env.ENVIRONMENT !== "test",
});

export default logger;
