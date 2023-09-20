import express from "express";
import { createDiscussion } from "../../controllers/discussion/createDiscussion";
import { getUserDiscussions } from "../../controllers/discussion/getUserDiscussions";
import { getDiscussionDetails } from "../../controllers/discussion/getDiscussionDetails";

const router = express.Router();

router.post("/", createDiscussion);
router.get("/", getUserDiscussions);
router.get("/:discussionId", getDiscussionDetails);

export default router;
