import limiter, { type Options } from "express-rate-limit";

interface Opts extends Partial<Omit<Options, "windowMs" | "limit">> {
  /**
   * How long (in millisecond) we should remember the requests.
   *
   * @default 60000
   */
  windowMs?: number;
  /**
   * The maximum number of connections to allow during the `window` before
   * rate limiting the client.
   *
   * Can be the limit itself as a number or express middleware that parses
   * the request and then figures out the limit.
   *
   * @default 30
   */
  limit?: number;
}

export default function rateLimiter(options?: Opts) {
  return limiter({
    ...options,
    windowMs: options?.windowMs ?? 60000,
    limit: options?.limit ?? 30,
  });
}
