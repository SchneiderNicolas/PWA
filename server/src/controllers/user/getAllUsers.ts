import { Request, Response } from "express";
import { handleDatabaseOperation } from "../../utils/handleDatabaseOperation";
import { prisma } from "../../utils/prisma";

// ---------------------------
// GET ALL USERS FUNCTION
// ---------------------------
/**
 * Fetches and returns all the users from the database.
 * - Queries the database to retrieve all users.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object to send back the fetched users.
 */
export const getAllUsers = handleDatabaseOperation(
  async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.json(users);
  }
);
