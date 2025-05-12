import { createLogger, format, transports } from "winston";


export const logger = createLogger({
  level: "info",
  exitOnError: false,
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});
