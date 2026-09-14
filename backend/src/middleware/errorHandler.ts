import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Unhandled error:', err.message);

  if (err.name === 'CastError') {
    res.status(400).json({ success: false, message: 'Invalid resource identifier' });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({ success: false, message: 'Data validation failed' });
    return;
  }

  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    res.status(409).json({ success: false, message: 'Duplicate resource' });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred',
  });
};
