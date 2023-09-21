import { Router } from "express";
import { loginUser } from "../../controllers/auth/loginUser";
import { registerInvitationCode } from "../../controllers/auth/registerInvitationCode";
import { registerUser } from "../../controllers/auth/registerUser";

const router = Router();

router.post("/register", registerUser);
router.post("/register-invite", registerInvitationCode);
router.post("/login", loginUser);

export default router;
