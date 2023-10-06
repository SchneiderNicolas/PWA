import { Request, Response } from "express";
import { handleDatabaseOperation } from "../../utils/handleDatabaseOperation";
import { prisma } from "../../utils/prisma";

export const getAllUsers = handleDatabaseOperation(
  async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        include: {
          subscription: true,
        },
      });
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching users with subscriptions");
    }
  }
);
