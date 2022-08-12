import { Request, Response } from 'express';

export const notFound = (
  _req: Request,
  res: Response
  /*  next: NextFunction */
) => {
  return res.status(404).send({ message: 'Unknown endpoint.' });
};
