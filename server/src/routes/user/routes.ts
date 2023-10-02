import express from "express";
import { searchUsers } from "../../controllers/user/searchUsers";

export const router = express.Router();

router.get("/", searchUsers);

export default router;
