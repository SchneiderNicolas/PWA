import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as yup from "yup";
import { prisma } from "../../utils/prisma";
import { handleDatabaseOperation } from "../../utils/handleDatabaseOperation";

// ---------------------------
// SCHEMA VALIDATIONS
// ---------------------------
const invitationAcceptanceSchema = yup.object().shape({
  inviteCode: yup.string().required(),
  name: yup.string().required(),
  password: yup.string().min(8).required(),
});

/**
 * Accepts the registration invitation of a user.
 * - Validates the request body.
 * - Finds the user by the provided invite code.
 * - Validates if the user hasn't registered already.
 * - Updates the user's name and password and marks them as registered.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
export const registerInvitationCode = handleDatabaseOperation(
  async (req: Request, res: Response) => {
    try {
      const body = req.body;

      // Validate the request body
      await invitationAcceptanceSchema.validate(body);

      // Find the user by their inviteCode
      const user = await prisma.user.findFirst({
        where: {
          inviteCode: body.inviteCode,
        },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid invite code" });
      }

      // Check if user is already registered
      if (user.isRegistered) {
        return res.status(400).json({ message: "User is already registered" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(body.password, 10);

      // Update user's name, password and set isRegistered to true
      const updatedUser = await prisma.user.update({
        where: {
          inviteCode: body.inviteCode,
        },
        data: {
          name: body.name,
          password: hashedPassword,
          isRegistered: true,
        },
      });

      const { password, ...result } = updatedUser;
      res.status(200).json(result);
    } catch (error) {
      const e = error as Error;
      res.status(500).json({ message: e.message, error: "An error occurred" });
    }
  }
);
