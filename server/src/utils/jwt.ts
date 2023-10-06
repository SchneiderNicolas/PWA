import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const DEFAULT_SIGN_OPTIONS: SignOptions = {
  expiresIn: "1d",
};

if (!process.env.SECRET_KEY) {
  throw new Error("SECRET_KEY must be defined");
}

export const signJwtAccessToken = (
  payload: JwtPayload,
  options: SignOptions = DEFAULT_SIGN_OPTIONS
): string => {
  const secretKey = process.env.SECRET_KEY!;
  return jwt.sign(payload, secretKey, options);
};

export const verifyJwt = (token: string): JwtPayload | null => {
  const secretKey = process.env.SECRET_KEY!;
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded as JwtPayload;
  } catch (error) {
    console.error(`Error verifying JWT: ${error}`);
    return null;
  }
};
