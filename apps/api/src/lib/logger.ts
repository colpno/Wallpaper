import { createLogger } from "@repo/logger";

import env from "../env";

const logger = createLogger({
  enabled: env.ENVIRONMENT !== "test",
});

export default logger;
