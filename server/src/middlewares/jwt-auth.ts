import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const tokenParts = authHeader.split(" ");

  if (!(tokenParts.length === 2 && tokenParts[0] === "Bearer")) {
    return res.status(401).json({ error: "Token error" });
  }

  const token = tokenParts[1];
  const decodedPayload = verifyJwt(token);

  if (!decodedPayload) {
    return res.status(403).json({ error: "Token is invalid or expired" });
  }

  req.userId = decodedPayload.id;
  req.userName = decodedPayload.name;

  next();
};
