import { Request, Response, NextFunction } from "express";
import { ZodTypeAny, ZodError } from "zod";
import { BadRequestError } from "../errors/app.error";

interface ValidationSchema {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

/**
 * Middleware factory that validates request body, query and params against Zod schemas.
 * In Express 5, req.query and req.params are re-defined via Object.defineProperty to preserve parsed types safely.
 */
export const validate = (schema: ValidationSchema) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        const parsedQuery = await schema.query.parseAsync(req.query);
        Object.defineProperty(req, "query", {
          value: parsedQuery,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
      if (schema.params) {
        const parsedParams = await schema.params.parseAsync(req.params);
        Object.defineProperty(req, "params", {
          value: parsedParams,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        return next(new BadRequestError("Validation failed", formattedErrors));
      }
      next(error);
    }
  };
};
