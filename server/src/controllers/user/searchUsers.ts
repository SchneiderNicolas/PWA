import { Request, Response } from "express";
import { handleDatabaseOperation } from "../../utils/handleDatabaseOperation";
import { prisma } from "../../utils/prisma";

// ---------------------------
// GET SEARCH USERS FUNCTION
// ---------------------------
/**
 * Fetches and returns users from the database that match the query parameter.
 * - Queries the database to retrieve matching users.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object to send back the fetched users.
 */
export const searchUsers = handleDatabaseOperation(
  async (req: Request, res: Response) => {
    try {
      const searchTerm = req.query.term as string;
      const userId = req.userId;

      if (!searchTerm) {
        return res.status(400).json({ error: "Search term must be provided" });
      }

      const users = await prisma.user.findMany({
        where: {
          NOT: [
            {
              id: userId,
            },
          ],
          OR: [
            {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          name: true,
          email: true,
          id: true,
        },
        take: 10,
      });

      return res.json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
