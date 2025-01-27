import express from "express";
import { calculatePartners, getDancePreferences } from "../controllers/danceController";

const router = express.Router();

// POST /calculate-partners
router.post("/calculate-partners", calculatePartners);

// GET /dance-preferences
router.get("/dance-preferences", getDancePreferences);

export default router;
