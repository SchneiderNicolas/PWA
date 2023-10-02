import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import crypto from "crypto";
import { handleDatabaseOperation } from "../../utils/handleDatabaseOperation";
import { sendInvitationEmail } from "../../services/emailService";

// ---------------------------
// CREATE DISCUSSION FUNCTION
// ---------------------------

/**
 * Creates a new discussion.
 * - Validates the request body for title and emails.
 * - Checks for existing users with the provided emails.
 * - Creates new unregistered users for emails not found.
 * - Generates an invite code for new users.
 * - Ensures the user making the request is added to the discussion.
 * - Creates a new discussion and connects all the users.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
export const createDiscussion = handleDatabaseOperation(
  async (req: Request, res: Response) => {
    if (
      !req.body.title ||
      typeof req.body.title !== "string" ||
      !req.body.title.trim()
    ) {
      return res.status(400).json({ error: "Invalid or missing title." });
    }

    if (
      !req.body.emails ||
      !Array.isArray(req.body.emails) ||
      !req.body.emails.every((email: any) => typeof email === "string")
    ) {
      return res.status(400).json({ error: "Invalid or missing emails." });
    }

    if (
      !req.body.message ||
      typeof req.body.message !== "string" ||
      !req.body.message.trim()
    ) {
      return res.status(400).json({ error: "Invalid or missing message." });
    }

    const {
      title,
      emails,
      message,
    }: { title: string; emails: string[]; message: string } = req.body;

    try {
      // Find all users by their emails
      const existingUsers = await prisma.user.findMany({
        where: {
          email: {
            in: emails,
          },
        },
      });

      const existingEmails = existingUsers.map((user) => user.email);

      // Identify emails that did not match any existing users
      const missingEmails: string[] = emails.filter(
        (email) => !existingEmails.includes(email)
      );

      // Split existing users into registered and non-registered users
      const registeredUsers = existingUsers.filter((user) => user.isRegistered);
      const unregisteredUsers = existingUsers.filter(
        (user) => !user.isRegistered
      );

      // For each missing email, create a new user with isRegistered set to false and an invite code
      const newUsers = [];
      const senderName = req.userName || "Someone";
      for (let email of missingEmails) {
        const newUser = await prisma.user.create({
          data: {
            email,
            isRegistered: false,
            inviteCode: uuidv4(),
            name: "",
            password: bcrypt.hashSync(
              crypto.randomBytes(16).toString("hex"),
              10
            ),
          },
        });
        newUsers.push(newUser);

        // Send an email invitation to the newly created user
        if (newUser.inviteCode) {
          // Check if inviteCode exists
          await sendInvitationEmail(email, senderName, newUser.inviteCode);
        } else {
          // Handle the case where the inviteCode is not available
          console.error("Invite code not found for user:", email);
        }
      }

      // For each unregistered user, send an invitation email
      for (let user of unregisteredUsers) {
        if (user.inviteCode) {
          // Check if inviteCode exists
          await sendInvitationEmail(user.email, senderName, user.inviteCode);
        } else {
          // Handle the case where the inviteCode is not available
          console.error("Invite code not found for user:", user.email);
        }
      }

      // Extract user IDs from the registered, unregistered, and new users
      const userIds = [
        ...registeredUsers,
        ...unregisteredUsers,
        ...newUsers,
      ].map((user) => user.id);

      // Ensure the user making the request is added to the discussion
      if (req.userId && !userIds.includes(req.userId)) {
        userIds.push(req.userId);
      }

      // Create a new discussion and connect the users
      const newDiscussion = await prisma.discussion.create({
        data: {
          title,
          users: {
            connect: userIds.map((id) => ({ id })),
          },
        },
      });

      // Create a new message and connect it to the discussion and the user who is sending the message
      if (req.userId) {
        await prisma.message.create({
          data: {
            content: message,
            userId: req.userId,
            discussionId: newDiscussion.id,
          },
        });
      } else {
        // handle the case where the user ID of the sender is not available
        console.error("User ID not found for the sender");
      }

      res.status(201).json(newDiscussion);
    } catch (error) {
      res.status(500).json({ error: "Failed to create a new discussion." });
    }
  }
);
