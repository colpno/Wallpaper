import { formatWithOptions } from "util";
import { createLogger, format, transports } from "winston";

import env from "@/lib/env";

const uppercaseLevel = format((info) => {
  info.level = info.level.toUpperCase();
  return info;
});

const revealHidden = format((info) => {
  const splat = info[Symbol.for("splat")] as unknown[];
  if (splat) {
    info.message = formatWithOptions(
      {
        depth: null,
        colors: true,
        maxArrayLength: null,
      },
      info.message,
      ...splat
    );
  }
  return info;
});

const logger = createLogger({
  transports: [
    new transports.Console({
      level: env.LOG_LEVEL,
      format: format.json(),
    }),
  ],
});

if (env.NODE_ENV === "development") {
  logger.clear(); // Remove default transports

  logger.add(
    new transports.Console({
      level: env.LOG_LEVEL,
      format: format.combine(
        uppercaseLevel(),
        revealHidden(),
        format.colorize({ level: true }),
        format.printf(({ level, message }) => `${level}:\t ${message}`)
      ),
    })
  );

  logger.add(
    new transports.File({
      dirname: "logs",
      filename: "app.log",
      level: env.LOG_LEVEL,
      maxsize: 1024 * 1024, // 1MB
      maxFiles: 3,
      format: format.combine(
        uppercaseLevel(),
        format.timestamp(),
        format.printf(({ level, message, timestamp, ...rest }) => {
          let msg = `${timestamp} ${level}: ${message}`;
          if (rest[Symbol.for("splat")] && (rest[Symbol.for("splat")] as unknown[]).length) {
            msg += ` ${JSON.stringify(rest[Symbol.for("splat")])}`;
          }
          return msg;
        })
      ),
    })
  );
}

export default logger;
