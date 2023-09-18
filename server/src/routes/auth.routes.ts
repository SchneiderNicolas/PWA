import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller"; // Change path accordingly

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
