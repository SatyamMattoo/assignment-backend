import express from "express";
import { getSubmission, postSubmission } from "../controllers/submission.js";
import { cacheMiddleware } from "../middlewares/cachedData.js";

const router = express.Router();

router.get("/all", cacheMiddleware, getSubmission);
router.post("/submit", postSubmission);

export default router;
