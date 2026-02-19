import { Response } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (err: any, res: Response) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      error: message,
      stack: err.stack,
      ...(err.details && { details: err.details }),
    });
  }

  return res.status(statusCode).json({
    error: message,
    ...(err.details && { details: err.details }),
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: any, res: Response, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
