import request from "supertest";
import app from "../src/server";

describe("Ballroom Dance Microservice", () => {
  it("should calculate the average number of dance partners", async () => {
    const response = await request(app).post("/calculate-partners").send({});
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("average_partners");
    expect(typeof response.body.average_partners).toBe("number");
  });
});
