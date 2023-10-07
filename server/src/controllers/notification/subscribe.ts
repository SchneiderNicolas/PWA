import { Request, Response } from "express";
import { handleDatabaseOperation } from "../../utils/handleDatabaseOperation";
import { prisma } from "../../utils/prisma";

export const subscribe = handleDatabaseOperation(
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId)
        return res.status(400).json({ error: "User ID must be provided" });

      const subscription = req.body.subscription;

      if (!subscription) {
        return res.status(400).json({ error: "Subscription must be provided" });
      }

      if (typeof subscription.endpoint !== "string" || !subscription.endpoint) {
        return res
          .status(400)
          .json({ error: "Subscription endpoint must be a non-empty string" });
      }

      if (typeof subscription.keys !== "object" || !subscription.keys) {
        return res
          .status(400)
          .json({ error: "Subscription keys must be provided" });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ error: "User not found" });

      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          endpoint: subscription.endpoint,
          keys: JSON.stringify(subscription.keys),
        },
        update: {
          endpoint: subscription.endpoint,
          keys: JSON.stringify(subscription.keys),
        },
      });

      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);
