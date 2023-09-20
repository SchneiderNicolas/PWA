import { Router } from "express";
import { loginUser } from "../../controllers/auth/loginUser";
import { registerUser } from "../../controllers/auth/registerUser";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
