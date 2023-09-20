import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import { formatDateForDisplay } from "../../utils/formatDateForDisplay";

export const getDiscussionDetails = async (req: Request, res: Response) => {
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
};
