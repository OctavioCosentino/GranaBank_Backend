import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../errors/app.error";

/**
 * Catches any unhandled route and throws a 404 NotFoundError.
 */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
};
