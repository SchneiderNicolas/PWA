import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).send({ status: 404, message: `Route ${req.url} not found.` });
};
