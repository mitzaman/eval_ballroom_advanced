import express from "express";
import { calculatePartners } from "../controllers/danceController";

const router = express.Router();

router.post("/calculate-partners", calculatePartners);

export default router;
