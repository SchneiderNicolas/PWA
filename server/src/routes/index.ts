import express from "express";
import authRoutes from "./auth/routes";
import userRoutes from "./user/routes";
import discussionRoutes from "./discussion/routes";
import messageRoutes from "./message/routes";
import notificationRoutes from "./notification/routes";
import { authenticateJWT } from "../middlewares/jwt-auth";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", authenticateJWT, userRoutes);
router.use("/discussions", authenticateJWT, discussionRoutes);
router.use("/messages", authenticateJWT, messageRoutes);
router.use("/notifications", authenticateJWT, notificationRoutes);

export default router;
