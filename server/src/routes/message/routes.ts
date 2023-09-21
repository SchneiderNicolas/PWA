import express from "express";
import { sendMessage } from "../../controllers/message/sendMessage";

const router = express.Router();

router.post("/send", sendMessage);

export default router;
