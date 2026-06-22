import winston from "winston";

const { combine, timestamp, json, printf } = winston.format;
const timestampFormat = "MMM-DD-YYYY HH:mm:ss";

export const logger = winston.createLogger({
  format: combine(
    timestamp({ format: timestampFormat }),
    json(),
    printf(({ timestamp, level, message, ...data }) => {
      const response = {
        level,
        timestamp,
        message,
        data,
      };

      // Use a replacer to avoid circular references
      const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key: string, value: any) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) return;
            seen.add(value);
          }
          return value;
        };
      };

      return JSON.stringify(response, getCircularReplacer());
    }),
  ),
  transports: [new winston.transports.Console()],
});
