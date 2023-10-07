import express from "express";
import { subscribe } from "../../controllers/notification/subscribe";
import { unsubscribe } from "../../controllers/notification/unsubscribe";

const router = express.Router();

router.post("/enable", subscribe);
router.delete("/disable", unsubscribe);

export default router;
