import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import { formatDateForDisplay } from "../../utils/formatDateForDisplay";

export const getUserDiscussions = async (req: Request, res: Response) => {
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
};
