import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app.error';
import { env } from '../config/env';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
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

  // Handle unexpected unhandled errors
  console.error('🔥 Unexpected Server Error:', err);

  res.status(500).json({
    success: false,
    error: {
      message: 'Internal Server Error',
      statusCode: 500,
      ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    },
  });
};

