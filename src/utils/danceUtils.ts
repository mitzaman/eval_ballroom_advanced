import { DanceParticipants, Pairing, DanceStyle } from '../types/index';

export const calculateAveragePartners = (data: DanceParticipants): number => {
  const leaderDancePartners: Record<number, Set<string>> = {};
  const followerDancePartners: Record<string, Set<number>> = {};

  // Helper function to find common styles between leader and follower
  const getCommonStyles = (leaderId: number, followerId: string): DanceStyle[] => {
    const leaderStyles: DanceStyle[] = data.leader_knowledge[leaderId] || [];
    const followerStyles: DanceStyle[] = data.follower_knowledge[followerId] || [];
    return leaderStyles.filter(style => followerStyles.includes(style)) as DanceStyle[];
  };

  // Function to calculate overall average
  const getOverallAverage = (avg1: number, avg2: number): number => (avg1 + avg2) / 2;

  // Total number of dance sessions (each session is 5 minutes)
  const totalDances = Math.floor(data.dance_duration_minutes / 5);

  for (let danceSession = 0; danceSession < totalDances; danceSession++) {
    const leaders = shuffleArray([...Array(data.total_leaders).keys()].map(i => i + 1)); // Leader IDs as numbers
    const followers = shuffleArray(Object.keys(data.follower_knowledge)); // Follower IDs as strings

    for (let i = 0; i < Math.min(leaders.length, followers.length); i++) {
      const leaderId = leaders[i];
      const followerId = followers[i]; // This remains a string

      const commonStyles: DanceStyle[] = getCommonStyles(leaderId, followerId);
      if (commonStyles.length > 0) {
        // Track unique dance partners
        if (!leaderDancePartners[leaderId]) leaderDancePartners[leaderId] = new Set();
        if (!followerDancePartners[followerId]) followerDancePartners[followerId] = new Set();

        leaderDancePartners[leaderId].add(followerId);
        followerDancePartners[followerId].add(leaderId);
      }
    }
  }

  // Calculate the average number of different dance partners
  const avgLeaders = Object.values(leaderDancePartners).reduce((sum, set) => sum + set.size, 0) / data.total_leaders;
  const avgFollowers = Object.values(followerDancePartners).reduce((sum, set) => sum + set.size, 0) / data.total_followers;
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