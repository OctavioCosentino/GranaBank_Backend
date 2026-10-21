import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env";
import { apiRouter } from "./routes";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";

/**
 * Creates and configures the Express application instance with security headers,
 * CORS, body parsers, logging and route handlers.
 */
export const createApp = (): Application => {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(","),
      credentials: true,
    }),
  );

  // HTTP Request logger
  if (env.NODE_ENV !== "test") {
    app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  }

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root status endpoint
  app.get("/", (_req, res) => {
    res.json({
      name: "GranaBank API",
      version: "1.0.0",
      status: "active",
      docs: "/api/v1/health",
    });
  });

  // Mount API Router under /api/v1
  app.use("/api/v1", apiRouter);

  // Catch 404 routes
  app.use(notFoundHandler);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
