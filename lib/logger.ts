// lib/logger.ts
export type LogLevel = "info" | "warn" | "error";

export const logger = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: (message: string, metadata?: Record<string, any>) => {
    console.log(
      JSON.stringify({
        level: "info",
        timestamp: new Date().toISOString(),
        message,
        ...metadata,
      })
    );
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn: (message: string, metadata?: Record<string, any>) => {
    console.warn(
      JSON.stringify({
        level: "warn",
        timestamp: new Date().toISOString(),
        message,
        ...metadata,
      })
    );
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (message: string, metadata?: Record<string, any>) => {
    console.error(
      JSON.stringify({
        level: "error",
        timestamp: new Date().toISOString(),
        message,
        ...metadata,
      })
    );
  },
};
