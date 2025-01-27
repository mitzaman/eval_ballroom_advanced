export interface Request extends Express.Request {
  // Custom properties can be added here
}

export interface Response extends Express.Response {
  // Custom properties can be added here
}

export type DanceStyle = "Waltz" | "Tango" | "Foxtrot";

export interface DanceParticipants {
  total_leaders: number;
  total_followers: number;
  dance_styles: DanceStyle[];
  leader_knowledge: Record<number, DanceStyle[]>;
  follower_knowledge: Record<string, DanceStyle[]>;
  dance_duration_minutes: number;
}

export interface Pairing {
  leader: number;
  follower: string;
  styles: DanceStyle[];
}