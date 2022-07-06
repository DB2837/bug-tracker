import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';

export const errorHandler = (
  error: HttpError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(res.statusCode || 500);
  if (process.env.NODE_ENV !== 'production') {
    res.json({
      message: error.message,
      stack: error.stack?.split('\n    '),
    });
  } else {
    res.json({
      message: error.message,
    });
  }

  next(error);
};
