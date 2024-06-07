const request = require("supertest");
const app = require("../app");
const { Notification, User } = require("../models");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const { createMockUser} = require("../testUtils/mockData");
const { successSymbol, errorSymbol } = require("../utils/consoleSymbols");

describe("Notification Controller", () => {
  let token;
  let notifications;
  beforeAll(async () => {
    await User.sync({ force: true });
    await Notification.sync({ force: true });

    const user = await createMockUser();
    token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET
    );

    notifications = await Notification.bulkCreate([
      { message: "You've been outbid.", user_id: user.id },
      { message: "Auction has ended", user_id: user.id },
    ]);
  });

  afterAll(async () => {
    await User.destroy({ where: {} });
    await Notification.destroy({ where: {} });
  });

  describe("GET /notifications", () => {
    it("should return all notifications of the current user", async () => {
      const res = await request(app)
        .get("/notifications")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });
  });

  describe("POST /notifications/mark-read", () => {
    it("should mark notification as read", async () => {
      const res = await request(app)
        .post("/notifications/mark-read")
        .set("Authorization", `Bearer ${token}`)
        .send({
          notification_ids: [
            notifications[0].toJSON().id,
            notifications[1].toJSON().id,
          ],
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
    });
  });
});
