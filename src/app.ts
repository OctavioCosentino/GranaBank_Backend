import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { env } from "./config/env";
import { apiRouter } from "./routes";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";

/**
 * Creates and configures Express application.
 */
export const createApp = (): Application => {
  const app = express();

  // Security headers (CSP disabled in dev for Swagger UI asset compatibility)
  app.use(
    helmet({
      contentSecurityPolicy: env.NODE_ENV === "production" ? undefined : false,
    }),
  );

  // CORS configuration
  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(","),
      credentials: true,
    }),
  );

  // Request logger
  if (env.NODE_ENV !== "test") {
    app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  }

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Swagger UI documentation (development only)
  if (env.NODE_ENV === "development") {
    const yamlPath = path.resolve(process.cwd(), "swagger.yaml");
    const yamalPath = path.resolve(process.cwd(), "swagger.yamal");
    const specPath = fs.existsSync(yamlPath) ? yamlPath : yamalPath;

    if (fs.existsSync(specPath)) {
      const swaggerDocument = YAML.load(specPath);
      app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }
  }

  // Root status endpoint
  app.get("/", (_req, res) => {
    res.json({
      name: "GranaBank API",
      version: "1.0.0",
      status: "active",
      docs: env.NODE_ENV === "development" ? "/doc" : "/api/v1/health",
    });
  });

  // API router
  app.use("/api/v1", apiRouter);

  // Unhandled routes
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
};
