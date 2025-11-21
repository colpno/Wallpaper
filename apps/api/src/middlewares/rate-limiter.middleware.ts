import limiter, { type Options } from "express-rate-limit";

import env from "@/env";

type Config = Omit<Options, "windowMs" | "limit"> & {
  /**
   * How long we should remember the requests.
   *
   * @default env.RATE_LIMIT_TIME
   */
  windowMs?: number;
  /**
   * The maximum number of connections to allow during the `window` before
   * rate limiting the client.
   *
   * Can be the limit itself as a number or express middleware that parses
   * the request and then figures out the limit.
   *
   * @default env.RATE_LIMIT_MAX
   */
  limit?: number;
};

const rateLimiter = (config?: Config) =>
  limiter({
    ...config,
    windowMs: config?.windowMs ?? env.RATE_LIMIT_TIME,
    limit: config?.limit ?? env.RATE_LIMIT_MAX,
  });

export default rateLimiter;
