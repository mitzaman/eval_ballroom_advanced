/**
 * @file danceUtils.test.ts
 * Expanded tests for the danceUtils module
 */
import { Pool } from "pg";
import {
  calculateAveragePartners,
  shuffleArray,
  getCommonStyles,
} from "../utils/danceUtils";
import { DanceParticipants } from "../types";

// -------------------------------
// 1. Mock the 'pg' library
// -------------------------------
jest.mock("pg", () => {
  const mockPool = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

describe("danceUtils Tests", () => {
  // Type-cast the mocked Pool instance
  const mockPoolInstance = (Pool as unknown as jest.Mock).mock.results[0].value;

  beforeEach(() => {
    // Reset mock calls before each test
    mockPoolInstance.query.mockClear();
  });

  // -------------------------------
  // Testing getCommonStyles()
  // -------------------------------
  describe("getCommonStyles()", () => {
    it("should return common styles between leader and follower", () => {
      const mockData: DanceParticipants = {
        total_leaders: 1,
        total_followers: 1,
        dance_styles: ["Waltz", "Tango", "Foxtrot"],
        leader_knowledge: { 1: ["Waltz", "Tango"] },
        follower_knowledge: { A: ["Waltz", "Tango", "Foxtrot"] },
        dance_duration_minutes: 15,
      };
      const styles = getCommonStyles(mockData, 1, "A");
      expect(styles).toEqual(["Waltz", "Tango"]);
    });
  });

  // -------------------------------
  // Testing shuffleArray()
  // -------------------------------
  describe("shuffleArray()", () => {
    it("should shuffle array elements in-place", () => {
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];
      const shuffled = shuffleArray(arr);

      expect(shuffled).toHaveLength(original.length);
      expect(shuffled.sort()).toEqual(original.sort());
      // We cannot guarantee the order due to randomness.
    });
  });

  // -------------------------------
  // Testing calculateAveragePartners()
  // -------------------------------
  describe("calculateAveragePartners()", () => {
    it("handles partial overlap of styles", async () => {
      const partialOverlapData: DanceParticipants = {
        total_leaders: 3,
        total_followers: 3,
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
        },
        dance_duration_minutes: 15, // => 3 sessions
      };

      const result = await calculateAveragePartners(partialOverlapData);

      // Because of shuffle, result may vary; but we expect some valid style matches.
      expect(typeof result).toBe("number");
      // At least one query() call should have been made due to partial overlap
      expect(mockPoolInstance.query).toHaveBeenCalled();
    });

    it("handles no overlap of styles", async () => {
      const noOverlapData: DanceParticipants = {
        total_leaders: 2,
        total_followers: 2,
        dance_styles: ["Waltz", "Tango", "Foxtrot"],
        leader_knowledge: {
          1: ["Waltz"],
          2: ["Tango"],
        },
        follower_knowledge: {
          A: ["Foxtrot"],
          B: ["Foxtrot"],
        },
        dance_duration_minutes: 10, // => 2 sessions
      };

      const result = await calculateAveragePartners(noOverlapData);

      // With zero overlap, we expect no valid style matches => no inserts
      expect(typeof result).toBe("number");
      // Should NOT call pool.query if no common styles exist
      expect(mockPoolInstance.query).not.toHaveBeenCalled();
      // The result is likely 0 average
      expect(result).toBe(0);
    });

    it("handles full overlap of styles", async () => {
      const fullOverlapData: DanceParticipants = {
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
        dance_duration_minutes: 10, // => 2 sessions
      };

      const result = await calculateAveragePartners(fullOverlapData);

      // We expect multiple inserts, because each pairing has 2 common styles
      expect(typeof result).toBe("number");
      // Because they all share styles, pool.query should have multiple calls
      expect(mockPoolInstance.query).toHaveBeenCalled();

      // Check how many times called. 
      // Each session => each pair => 2 possible styles => 
      // but random shuffle may reorder pairs. We'll just check it's > 0
      expect(mockPoolInstance.query.mock.calls.length).toBeGreaterThan(0);
      // The result might be as high as 2 in a 2v2 scenario, but the shuffle can affect it.
      // So let's just confirm it's not zero
      expect(result).toBeGreaterThan(0);
    });

    it("handles zero leaders or zero followers", async () => {
      const zeroLeaders: DanceParticipants = {
        total_leaders: 0,
        total_followers: 3,
        dance_styles: ["Waltz", "Tango", "Foxtrot"],
        leader_knowledge: {},
        follower_knowledge: {
          A: ["Waltz", "Tango"],
          B: ["Foxtrot"],
          C: ["Waltz", "Foxtrot"],
        },
        dance_duration_minutes: 15,
      };

      // This scenario might throw an error or produce 0. Let's see how we handle it.
      // If your actual code doesn't handle zero leaders, you might want to add a guard.
      let result = await calculateAveragePartners(zeroLeaders);
      expect(typeof result).toBe("number");
      // Should result in 0 average or NaN, depending on your logic. 
      // The function as written would do average over 0 => NaN. 
      // You might want to add a guard for dividing by zero if needed:
      // We'll just confirm no DB calls were made
      expect(mockPoolInstance.query).not.toHaveBeenCalled();
      expect(result).toBeNaN(); // or 0, depending on your code changes

      mockPoolInstance.query.mockClear();

      const zeroFollowers: DanceParticipants = {
        total_leaders: 3,
        total_followers: 0,
        dance_styles: ["Waltz"],
        leader_knowledge: { 1: ["Waltz"], 2: ["Waltz"], 3: ["Waltz"] },
        follower_knowledge: {},
        dance_duration_minutes: 15,
      };
      result = await calculateAveragePartners(zeroFollowers);
      expect(typeof result).toBe("number");
      expect(mockPoolInstance.query).not.toHaveBeenCalled();
      expect(result).toBeNaN();
    });

    it("handles zero dance_duration_minutes", async () => {
      const zeroDurationData: DanceParticipants = {
        total_leaders: 2,
        total_followers: 2,
        dance_styles: ["Waltz"],
        leader_knowledge: {
          1: ["Waltz"],
          2: ["Waltz"],
        },
        follower_knowledge: {
          A: ["Waltz"],
          B: ["Waltz"],
        },
        dance_duration_minutes: 0, // => 0 sessions
      };

      const result = await calculateAveragePartners(zeroDurationData);
      // No sessions => no queries => result likely 0
      expect(result).toBe(0);
      expect(mockPoolInstance.query).not.toHaveBeenCalled();
    });

    it("handles a bigger scenario with partial overlap", async () => {
      const bigData: DanceParticipants = {
        total_leaders: 5,
        total_followers: 5,
        dance_styles: ["Waltz", "Tango", "Foxtrot", "Quickstep"],
        leader_knowledge: {
          1: ["Waltz", "Tango"],
          2: ["Foxtrot"],
          3: ["Waltz", "Foxtrot", "Quickstep"],
          4: ["Tango", "Quickstep"],
          5: ["Waltz"],
        },
        follower_knowledge: {
          A: ["Waltz", "Foxtrot"],
          B: ["Tango", "Quickstep"],
          C: ["Tango", "Waltz"],
          D: ["Quickstep"],
          E: ["Foxtrot", "Tango"],
        },
        dance_duration_minutes: 25, // => 5 sessions
      };

      const result = await calculateAveragePartners(bigData);
      expect(typeof result).toBe("number");
      // Some overlap is guaranteed, so we expect at least one DB insert
      expect(mockPoolInstance.query).toHaveBeenCalled();
      expect(result).toBeGreaterThan(0);
    });
  });
});
