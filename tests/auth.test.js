const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { createMockUser } = require("../testUtils/mockData");

describe("Auth Controller", () => {
  beforeEach(async () => {
    // Clear the User table before each test
    await User.destroy({ where: {} });
  });

  describe("User Registration", () => {
    it("should register a new user", async () => {
      const hashedPassword = await bcrypt.hash("testpassword", 10);
      const res = await request(app).post("/users/register").send({
        username: "testuser",
        password: hashedPassword,
        email: "test@example.com",
      });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("user");
    });

    it("should return 400 for duplicate email", async () => {
      const hashedPassword = await bcrypt.hash("testpassword", 10);
      await User.create({
        username: "testuser2",
        password: hashedPassword,
        email: "duplicate@example.com",
      });

      const res = await request(app).post("/users/register").send({
        username: "testuser2",
        password: hashedPassword,
        email: "duplicate@example.com",
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe("User Login", () => {
    it("should login an existing user", async () => {
      await createMockUser({
        email: "login@example.com",
        password: "testpassword",
      });
      const res = await request(app).post("/users/login").send({
        email: "login@example.com",
        password: "testpassword",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should return 400 for invalid credentials", async () => {
      const res = await request(app).post("/users/login").send({
        email: "invalid@example.com",
        password: "wrongpassword",
      });
      expect(res.statusCode).toBe(400);
    });
  });
});
