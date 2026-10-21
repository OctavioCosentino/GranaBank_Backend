import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error";
import { env } from "../config/env";

/**
 * Global error handler middleware.
 * Formats custom AppErrors and unexpected exceptions into a standard JSON payload.
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        statusCode: err.statusCode,
        details: err.details,
      },
    });
    return;
  }

  // Handle unexpected unhandled errors (including Supabase PostgrestError)
  const message = err?.message || "Internal Server Error";
  const details = err?.details || err?.hint || undefined;
  console.error("Server Error Handler caught:", message, details || "", err);

  res.status(500).json({
    success: false,
    error: {
      message:
        env.NODE_ENV === "development" ? message : "Internal Server Error",
      statusCode: 500,
      details,
      ...(env.NODE_ENV === "development" ? { stack: err?.stack } : {}),
    },
  });
};
