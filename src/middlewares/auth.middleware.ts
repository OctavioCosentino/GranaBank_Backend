import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../config/supabase";
import { UnauthorizedError } from "../errors/app.error";

/**
 * Middleware that validates the Bearer JWT token against Supabase Auth.
 * Injects authenticated User instance into req.user and the token string into req.token.
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Missing or malformed Authorization header");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("Access token is required");
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedError(
        error?.message || "Invalid, expired, or revoked token",
      );
    }

    req.user = data.user;
    req.token = token;
    next();
  } catch (err) {
    next(err);
  }
};
