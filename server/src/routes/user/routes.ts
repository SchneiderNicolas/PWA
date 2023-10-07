import express from "express";
import { searchUsers } from "../../controllers/user/searchUsers";
import { getAllUsers } from "../../controllers/user/allUser";

export const router = express.Router();

router.get("/", searchUsers);
router.get("/all", getAllUsers);

export default router;
