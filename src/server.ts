import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log("====================================================");
  console.log(`GranaBank Backend running on port ${env.PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`Base URL: http://localhost:${env.PORT}/api/v1`);
  console.log(`Health check: http://localhost:${env.PORT}/api/v1/health`);
  if (env.NODE_ENV === "development") {
    console.log(`Swagger UI: http://localhost:${env.PORT}/doc`);
  }
  console.log("====================================================");
});

/**
 * Handles graceful shutdown on SIGTERM / SIGINT signals.
 */
const gracefulShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log("Closed out remaining connections.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down",
    );
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
