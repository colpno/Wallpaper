import handler from "morgan";

import { env } from "@/configs/env.js";
import { logger } from "@/lib/logger.js";

let morgan: ReturnType<typeof handler>;

if (env.ENVIRONMENT === "production") {
  morgan = handler(
    (tokens, req, res) => {
      return JSON.stringify({
        method: tokens["method"]?.(req, res),
        url: tokens["url"]?.(req, res),
        status: Number(tokens["status"]?.(req, res)),
        contentLength: tokens["res"]?.(req, res, "content-length"),
        responseTime: Number(tokens["response-time"]?.(req, res)),
      });
    },
    {
      stream: {
        write: logger.info,
      },
    }
  );
} else {
  morgan = handler("dev");
}

export { morgan };
