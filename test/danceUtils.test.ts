import { calculateAveragePartners } from '../src/utils/danceUtils';
import { DanceParticipants } from '../src/types/index';

describe('average function', () => {
  test('calculates the overall average number of different dance partners correctly', () => {
    const inputData: DanceParticipants = {
      total_leaders: 3,
      total_followers: 5,
      dance_styles: ["Waltz", "Tango", "Foxtrot"],
      leader_knowledge: {
        1: ["Waltz", "Tango"],
        2: ["Foxtrot"],
        3: ["Waltz", "Foxtrot"],
      },
      follower_knowledge: {
        A: ["Waltz", "Tango", "Foxtrot"],
        B: ["Tango"],
        C: ["Waltz"],
        D: ["Tango", "Foxtrot"],
        E: ["Waltz", "Tango"]
      },
      dance_duration_minutes: 40
    };

    const result = calculateAveragePartners(inputData);

    // Since the function involves randomness (shuffling), we test if it returns a reasonable value
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(inputData.total_followers); // Should be within expected range
  });

  test('returns 0 when there are no dance styles in common', () => {
    const inputData: DanceParticipants = {
      total_leaders: 2,
      total_followers: 2,
      dance_styles: ["Waltz", "Tango"],
      leader_knowledge: {
        1: ["Waltz"],
        2: ["Tango"],
      },
      follower_knowledge: {
        A: ["Foxtrot"], // No overlap with leaders
        B: ["Foxtrot"], // No overlap with leaders
      },
      dance_duration_minutes: 40
    };

    const result = calculateAveragePartners(inputData);
    expect(result).toBe(0);
  });

  test('handles case where leaders and followers have perfect style matches', () => {
    const inputData: DanceParticipants = {
      total_leaders: 2,
      total_followers: 2,
      dance_styles: ["Waltz", "Tango"],
      leader_knowledge: {
        1: ["Waltz", "Tango"],
        2: ["Waltz", "Tango"],
      },
      follower_knowledge: {
        A: ["Waltz", "Tango"],
        B: ["Waltz", "Tango"],
      },
      dance_duration_minutes: 40
    };

    const result = calculateAveragePartners(inputData);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(2); // Should be within expected range
  });
});