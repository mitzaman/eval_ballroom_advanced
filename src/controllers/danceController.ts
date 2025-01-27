import { Request, Response } from "express";
import { calculateAveragePartners } from "../utils/danceUtils";

// Controller function for calculating partners
export const calculatePartners = (req: Request, res: Response) => {
  const ballroomData = req.body;
  
  if (!ballroomData.total_leaders || !ballroomData.total_followers || !ballroomData.dance_duration_minutes) {
    return res.status(400).json({ error: "Missing required fields in request body" });
  }
  
  const avgPartners = calculateAveragePartners(ballroomData);
  res.json({ average_partners: avgPartners });
}; 
