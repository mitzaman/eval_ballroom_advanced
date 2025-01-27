import { Pool } from "pg";
import { DanceParticipants, Pairing, DanceStyle } from "../types/index";

// Configure PG Pool (uses DATABASE_URL from environment by default)
const pool = new Pool();

// Helper function to find common styles between leader and follower
export const getCommonStyles = (
  data: DanceParticipants,
  leaderId: number,
  followerId: string
): DanceStyle[] => {
  const leaderStyles: DanceStyle[] = data.leader_knowledge[leaderId] || [];
  const followerStyles: DanceStyle[] = data.follower_knowledge[followerId] || [];
  return leaderStyles.filter((style) => followerStyles.includes(style)) as DanceStyle[];
};

// Function to calculate overall average
const getOverallAverage = (avg1: number, avg2: number): number => (avg1 + avg2) / 2;

// Make the function asynchronous so we can await DB operations
export const calculateAveragePartners = async (data: DanceParticipants): Promise<number> => {
  const leaderDancePartners: Record<number, Set<string>> = {};
  const followerDancePartners: Record<string, Set<number>> = {};

  // Total number of dance sessions (each session is 5 minutes)
  const totalDances = Math.floor(data.dance_duration_minutes / 5);

  for (let danceSession = 0; danceSession < totalDances; danceSession++) {
    const leaders = shuffleArray(
      [...Array(data.total_leaders).keys()].map((i) => i + 1) // Leader IDs
    );
    const followers = shuffleArray(Object.keys(data.follower_knowledge)); // Follower IDs

    for (let i = 0; i < Math.min(leaders.length, followers.length); i++) {
      const leaderId = leaders[i];
      const followerId = followers[i];

      const commonStyles: DanceStyle[] = getCommonStyles(data, leaderId, followerId);

      // For each valid style, insert a record into Postgres
      for (const style of commonStyles) {
        try {
          await pool.query(
            `INSERT INTO dance_sessions (leader_id, follower_id, style, session_number)
             VALUES ($1, $2, $3, $4)`,
            [leaderId, followerId, style, danceSession]
          );
        } catch (error) {
          console.error("Error inserting dance session into DB:", error);
        }
      }

      // If at least one valid style was found, track these unique partners
      if (commonStyles.length > 0) {
        if (!leaderDancePartners[leaderId]) {
          leaderDancePartners[leaderId] = new Set();
        }
        if (!followerDancePartners[followerId]) {
          followerDancePartners[followerId] = new Set();
        }

        leaderDancePartners[leaderId].add(followerId);
        followerDancePartners[followerId].add(leaderId);
      }
    }
  }

  // Calculate the average number of different dance partners
  const avgLeaders =
    Object.values(leaderDancePartners).reduce((sum, set) => sum + set.size, 0) /
    data.total_leaders;

  const avgFollowers =
    Object.values(followerDancePartners).reduce((sum, set) => sum + set.size, 0) /
    data.total_followers;

  const overallAvg = getOverallAverage(avgLeaders, avgFollowers);

  console.log(`Average different dance partners per leader: ${avgLeaders.toFixed(2)}`);
  console.log(`Average different dance partners per follower: ${avgFollowers.toFixed(2)}`);
  console.log(`Overall average different dance partners: ${overallAvg.toFixed(2)}`);

  return overallAvg;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
};
