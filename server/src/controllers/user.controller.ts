import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { handleDatabaseOperation } from "../utils/handleDatabaseOperation";

const prisma = new PrismaClient();

export const getAllUsers = handleDatabaseOperation(
  async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.json(users);
  }
);
