import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error for debugging
  console.error(err);

  // Handle MongoDB/Mongoose errors
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      message: 'Invalid ID format'
    });
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    message: 'Internal Server Error'
  });
};