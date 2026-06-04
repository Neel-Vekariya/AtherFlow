import request from "supertest";
import app from "../src/app.js";

describe("Basic Routes", () => {

  test("GET / should return Hello World", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello, World!");
  });

});

test("GET /health should return 200", async () => {
  const res = await request(app).get("/health");

  expect(res.statusCode).toBe(200);
}); 


test("GET /ready should return 200", async () => {
  const res = await request(app).get("/ready");

  expect(res.statusCode).toBe(200);
}); 