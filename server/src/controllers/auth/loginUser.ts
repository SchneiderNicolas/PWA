import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as yup from "yup";
import { prisma } from "../../utils/prisma";
import { signJwtAccessToken } from "../../utils/jwt";

// ---------------------------
// SCHEMA VALIDATIONS
// ---------------------------
const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

// ---------------------------
// LOGIN USER FUNCTION
// ---------------------------
/**
 * Logs in an existing user.
 * - Validates the request body.
 * - Checks the email and password against the database.
 * - Generates a JWT token if successful.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    await loginSchema.validate(body);

    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const accessToken = signJwtAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Extract only the desired properties to return in the response
    const responsePayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      accessToken: accessToken,
    };

    res.json(responsePayload);
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ message: e.message, error: "An error occurred" });
  }
};
