import { createLogger } from "@repo/logger";

import env from "@/configs/env.js";

const logger = createLogger({
  enabled: env.ENVIRONMENT !== "test",
  level: env.LOG_LEVEL,
});

export default logger;
