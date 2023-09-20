import { Request, Response } from "express";
import { handleDatabaseOperation } from "../../utils/handleDatabaseOperation";
import { prisma } from "../../utils/prisma";

export const getAllUsers = handleDatabaseOperation(
  async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.json(users);
  }
);
