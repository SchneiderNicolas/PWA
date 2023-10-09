import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import { handleDatabaseOperation } from "../../utils/handleDatabaseOperation";
import { sendNotification } from "../../services/notificationService";
import { io } from "../../server";

// ---------------------------
// SEND MESSAGE FUNCTION
// ---------------------------
/**
 * Sends a new message in a given discussion by an authenticated user.
 * - Validates that the user is authenticated.
 * - Checks and validates message content and discussionId from the request body.
 * - Ensures the user is a member of the target discussion.
 * - If all checks pass, creates a new message entry in the database.
 * @param {Request} req - Express request object containing userId and other necessary parameters in the request body.
 * @param {Response} res - Express response object.
 */

export const sendMessage = handleDatabaseOperation(
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "User is not authenticated." });
    }

    if (
      !req.body.content ||
      typeof req.body.content !== "string" ||
      !req.body.content.trim()
    ) {
      return res.status(400).json({ error: "Invalid or missing content." });
    }

    if (!req.body.discussionId || typeof req.body.discussionId !== "number") {
      return res
        .status(400)
        .json({ error: "Invalid or missing discussionId." });
    }

    const { content, discussionId } = req.body;

    try {
      // Ensure the user is part of the discussion
      const discussion = await prisma.discussion.findUnique({
        where: { id: discussionId },
        include: { users: true },
      });

      if (!discussion) {
        return res.status(404).json({ error: "Discussion not found." });
      }

      const isMember = discussion.users.some((user) => user.id === userId);
      if (!isMember) {
        return res
          .status(403)
          .json({ error: "User is not a member of this discussion." });
      }

      // Create the message
      const newMessage = await prisma.message.create({
        data: {
          content: content,
          userId: userId,
          discussionId: discussionId,
        },
      });

      await prisma.discussion.update({
        where: { id: discussionId },
        data: { seenBy: [userId] },
      });

      // Get the name of the user who sent the message
      const sendingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });

      if (!sendingUser || !sendingUser.name) {
        return res
          .status(404)
          .json({ error: "Sending user not found or has no name." });
      }

      const sendingUserName = sendingUser.name;
      const baseURL =
        process.env.NODE_ENV === "production"
          ? "https://pwa.nicolas-schneider.fr"
          : "http://localhost:3000";

      const targetURL = `${baseURL}/discussion/${discussionId}`;

      // Send notifications to users
      const userIDsToNotify = discussion.users
        .filter((user) => user.id !== userId)
        .map((user) => user.id);

      io.to(discussionId.toString()).emit("new-message", {
        discussionId,
        message: newMessage,
        sender: sendingUserName,
      });

      userIDsToNotify.forEach((userId) => {
        io.to(userId.toString()).emit("new-message-notification", {
          discussionId,
          message: newMessage,
          sender: sendingUserName,
        });
      });

      await sendNotification(
        userIDsToNotify,
        `New message from ${sendingUserName}`,
        content,
        targetURL
      );

      res.status(201).json({ message: "Message successfully sent!" });
    } catch (error) {
      res.status(500).json({ error: "Failed to send the message." });
    }
  }
);
