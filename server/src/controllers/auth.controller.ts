import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as yup from "yup";
import { prisma } from "../utils/prisma";
import { signJwtAccessToken } from "../utils/jwt";

// ---------------------------
// SCHEMA VALIDATIONS
// ---------------------------
const registerSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

// ---------------------------
// REGISTER USER FUNCTION
// ---------------------------
/**
 * Registers a new user.
 * - Validates the request body.
 * - Checks for existing users with the same email.
 * - Hashes the password and stores the user in the database.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    await registerSchema.validate(body);

    const existingUser = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email is already used" });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
      },
    });

    const { password, ...result } = user;
    res.status(201).json(result);
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ message: e.message, error: "An error occurred" });
  }
};

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

    const { password, ...userWithoutSensitiveInfo } = user;
    const accessToken = signJwtAccessToken(userWithoutSensitiveInfo);

    res.json({ ...userWithoutSensitiveInfo, accessToken });
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ message: e.message, error: "An error occurred" });
  }
};
