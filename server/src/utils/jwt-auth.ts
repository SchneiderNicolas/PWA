import { verifyJwt } from "./jwt";

export const authenticateJWT = async (
  request: Request
): Promise<{
  auth: boolean;
  status: number;
  userId?: number;
  error?: string;
}> => {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return Promise.resolve({
      auth: false,
      status: 401,
      error: "No token provided",
    });
  }

  const tokenParts = authHeader.split(" ");

  if (!(tokenParts.length === 2 && tokenParts[0] === "Bearer")) {
    return Promise.resolve({ auth: false, status: 401, error: "Token error" });
  }

  const token = tokenParts[1];
  const decoded = verifyJwt(token);

  if (!decoded) {
    return Promise.resolve({
      auth: false,
      status: 403,
      error: "Token is invalid or expired",
    });
  }

  return Promise.resolve({ auth: true, status: 200, userId: decoded.id });
};
