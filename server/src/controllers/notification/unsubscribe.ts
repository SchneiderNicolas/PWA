import { Request, Response } from "express";
import { handleDatabaseOperation } from "../../utils/handleDatabaseOperation";
import { prisma } from "../../utils/prisma";

export const unsubscribe = handleDatabaseOperation(
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId;

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ error: "User not found" });

      await prisma.subscription.delete({
        where: { userId },
      });

      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error(error);
      if (error.code === "P2016") {
        return res
          .status(404)
          .json({ error: "Subscription not found for the provided user ID" });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);
