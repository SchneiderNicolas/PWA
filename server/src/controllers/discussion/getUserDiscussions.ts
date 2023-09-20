import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import { formatDateForDisplay } from "../../utils/formatDateForDisplay";
import { handleDatabaseOperation } from "../../utils/handleDatabaseOperation";

// ---------------------------
// GET USER DISCUSSIONS FUNCTION
// ---------------------------
/**
 * Retrieves the list of discussions associated with the requesting user.
 * - Fetches discussions where the user is a participant.
 * - Includes the latest message from each discussion for context.
 * - Formats the creation time of the latest message for display.
 * @param {Request} req - Express request object containing userId in the request object.
 * @param {Response} res - Express response object.
 */
export const getUserDiscussions = handleDatabaseOperation(
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId;

      const discussions = await prisma.discussion.findMany({
        where: {
          users: {
            some: {
              id: userId,
            },
          },
        },
        include: {
          users: {
            select: {
              name: true,
              email: true,
            },
          },
          messages: {
            take: 1,
            orderBy: {
              createdAt: "desc",
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

      const discussionsForResponse = discussions.map((discussion) => {
        const formattedCreatedAt = discussion.messages[0]
          ? formatDateForDisplay(discussion.messages[0].createdAt)
          : null;

        return {
          ...discussion,
          messages: discussion.messages.map((message) => ({
            ...message,
            formattedCreatedAt,
          })),
        };
      });

      res.status(200).json(discussionsForResponse);
    } catch (error) {
      const e = error as Error;
      res.status(500).json({
        message: e.message,
        error: "An error occurred while fetching user's discussions.",
      });
    }
  }
);
