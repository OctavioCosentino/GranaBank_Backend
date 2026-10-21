import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  has_next_page: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationMeta;
  error?: unknown;
}

export const sendSuccess = <T>(
  res: Response,
  data?: T,
  statusCode: number = 200,
  message?: string,
  pagination?: PaginationMeta
): Response => {
  const body: ApiResponse<T> = {
    success: true,
    ...(message ? { message } : {}),
    ...(data !== undefined ? { data } : {}),
    ...(pagination !== undefined ? { pagination } : {}),
  };
  return res.status(statusCode).json(body);
};
