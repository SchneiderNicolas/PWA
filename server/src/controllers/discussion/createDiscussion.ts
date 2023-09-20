import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import crypto from "crypto";

export const createDiscussion = async (req: Request, res: Response) => {
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
  const { title, emails }: { title: string; emails: string[] } = req.body;

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
    for (let email of missingEmails) {
      const newUser = await prisma.user.create({
        data: {
          email,
          isRegistered: false,
          inviteCode: uuidv4(),
          name: "",
          password: bcrypt.hashSync(crypto.randomBytes(16).toString("hex"), 10),
        },
      });
      newUsers.push(newUser);

      // For now, log the new user, later you can send an email
      console.log("Created new user:", newUser);
    }

    // For each unregistered user, print their info, later you can send an email
    for (let user of unregisteredUsers) {
      console.log("Unregistered user:", user);
    }

    // Extract user IDs from the registered, unregistered, and new users
    const userIds = [...registeredUsers, ...unregisteredUsers, ...newUsers].map(
      (user) => user.id
    );

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

    res.status(201).json(newDiscussion);
  } catch (error) {
    res.status(500).json({ error: "Failed to create a new discussion." });
  }
};
