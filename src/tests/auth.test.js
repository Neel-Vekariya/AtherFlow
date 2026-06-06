import { signToken, verifyToken } from "../auth/jwt.js";
import request from "supertest";
import app from "../app.js";

describe("JWT Tests", () => {

  test("should throw error for expired token", async () => {

    const secret = "test-secret";
    const token = signToken(
      {
        tenant_id: "tenant-1",
        roles: ["webhook:write"]
      },
      secret,
      "1ms"
    );

    await new Promise(resolve => setTimeout(resolve, 20));

    expect(() => {
      verifyToken(token, secret);
    }).toThrow("Token expired");

  });

});


describe("Auth Middleware", () => {

  test("should reject requests without credentials", async () => {

    const response = await request(app)
      .post("/webhook")
      .send({});

    expect(response.status).toBe(401);

    expect(response.body.error)
      .toBe("No Credentials Provided.");

  });

});

test("should reject invalid token", () => {

    const secret = "test-secret";

  expect(() => {

    verifyToken(
      "fake-token",
      secret
    );

  }).toThrow("Invalid token");

});
