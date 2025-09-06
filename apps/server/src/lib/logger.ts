import { createLogger, format, transports } from "winston";

const appName = process.env.APP_NAME || "Server";

export const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.json(),
  transports: [
    process.env.NODE_ENV === "production"
      ? new transports.Console()
      : new transports.Console({
          format: format.combine(
            format.timestamp(),
            format.colorize(),
            format.printf(({ timestamp, level, message, label, ...meta }) => {
              return `[${label || appName}] ${timestamp} ${level}: ${message} ${JSON.stringify(meta)}`;
            })
          ),
        }),
  ],
  exitOnError: false,
});
