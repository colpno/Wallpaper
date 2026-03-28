import pino, { type LoggerOptions } from "pino";

export const createLogger = (config?: LoggerOptions) => pino(config);

export type { Level } from "pino";
export { pino };
