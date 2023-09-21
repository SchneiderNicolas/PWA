import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import { formatDateForDisplay } from "../../utils/formatDateForDisplay";
import { handleDatabaseOperation } from "../../utils/handleDatabaseOperation";

// ---------------------------
// GET DISCUSSION DETAILS FUNCTION
// ---------------------------
/**
 * Retrieves the details of a specific discussion.
 * - Validates the provided discussionId.
 * - Fetches the discussion details including associated users and messages.
 * - Checks if the requesting user is a member of the discussion.
 * - Formats the creation time of each message for display.
 * @param {Request} req - Express request object containing discussionId in params and userId in the request object.
 * @param {Response} res - Express response object.
 */
export const getDiscussionDetails = handleDatabaseOperation(
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId;

      const discussionId = parseInt(req.params.discussionId, 10);
      if (!discussionId) {
        return res
          .status(400)
          .json({ error: "Invalid or missing discussionId." });
      }

      const discussion = await prisma.discussion.findUnique({
        where: {
          id: discussionId,
        },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: "asc",
            },
            select: {
              content: true,
              createdAt: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!discussion) {
        return res.status(404).json({ error: "Discussion not found." });
      }

      const isMember = discussion.users.some((user) => user.id === userId);
      if (!isMember) {
        return res
          .status(403)
          .json({ error: "User is not authorized to access this discussion." });
      }

      const discussionForResponse = {
        ...discussion,
        messages: discussion.messages.map((message) => ({
          ...message,
          formattedCreatedAt: formatDateForDisplay(message.createdAt),
        })),
      };

      res.status(200).json(discussionForResponse);
    } catch (error) {
      const e = error as Error;
      res.status(500).json({
        message: e.message,
        error: "An error occurred while fetching the discussion details.",
      });
    }
  }
);
