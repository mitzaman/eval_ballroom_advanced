// danceController.ts
import { Request, Response } from "express";
import { calculateAveragePartners } from "../utils/danceUtils";

import { Pool } from "pg";

const pool = new Pool(); 


export const calculatePartners = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const overallAvg = await calculateAveragePartners(data); // <-- await here
    res.json({ average_partners: overallAvg });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getDancePreferences = async (req: Request, res: Response) => {
  try {
    // Query all styles by their usage count
    const { rows } = await pool.query(`
      SELECT style, COUNT(*) AS usage_count
      FROM dance_sessions
      GROUP BY style
      ORDER BY usage_count DESC
    `);

    // If no rows in dance_sessions, return empty results
    if (!rows || rows.length === 0) {
      return res.json({
        most_popular: null,
        least_popular: null,
        message: "No dance sessions found"
      });
    }

    const mostPopular = rows[0];
    const leastPopular = rows[rows.length - 1];

    return res.json({
      most_popular: mostPopular,
      least_popular: leastPopular
    });
  } catch (error) {
    console.error("Error fetching dance preferences:", error);
    return res.status(500).json({ error: "Failed to fetch dance preferences" });
  }
};
