const request = require("supertest");
const app = require("../app");
const { Item, User } = require("../models");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const { createMockUser, createMockItem } = require("../testUtils/mockData");
const { errorSymbol, successSymbol } = require('../utils/consoleSymbols');

describe("Item Controller", () => {
  let token;

  beforeAll(async () => {
    await Item.sync({ force: true });
    await User.sync({ force: true });
    const user = await createMockUser();
    token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET
    );
  });

  beforeEach(async () => {
    await Item.destroy({ where: {} });
  });

  afterAll(async () => {
    await Item.destroy({ where: {} });
    await User.destroy({ where: {} });

    const uploadDir = path.join(__dirname, "..", "uploads");
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      const testFiles = files.filter((file) => /-test\..+$/.test(file));
      testFiles.forEach((file) => {
        const filePath = path.join(uploadDir, file);
        fs.unlinkSync(filePath);
      });
    } else {
      console.log("Upload directory does not exist. Skipping cleanup.");
    }
  });

  describe("GET /items?page=1&limit=10", () => {
    it("should return all items", async () => {
      const res = await request(app).get("/items");
      expect(res.statusCode).toBe(200);
    });
  });

  describe("POST /items", () => {
    it("should create a new item with an image", async () => {
      const newItem = {
        name: "Test Item",
        description: "This is a test item",
        starting_price: 10,
        end_time: new Date().toISOString(),
      };

      const res = await request(app)
        .post("/items")
        .set("Authorization", `Bearer ${token}`)
        .field("name", newItem.name)
        .field("description", newItem.description)
        .field("starting_price", newItem.starting_price)
        .field("end_time", newItem.end_time)
        .attach("image", path.resolve(__dirname, "testImage.jpg"));

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.name).toBe(newItem.name);
      expect(res.body.description).toBe(newItem.description);
      expect(res.body.image_url).toBeTruthy();
    });

    it("should create a new item without an image", async () => {
      const newItem = {
        name: "Test Item",
        description: "This is a test item",
        starting_price: 10,
        end_time: new Date().toISOString(),
      };

      const res = await request(app)
        .post("/items")
        .set("Authorization", `Bearer ${token}`)
        .send(newItem);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.name).toBe(newItem.name);
      expect(res.body.description).toBe(newItem.description);
      expect(res.body.image_url).toBeNull();
    });
  });

  describe("GET /items/:id", () => {
    it("should return a specific item", async () => {
      const item = await createMockItem();
      const res = await request(app).get(`/items/${item.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(item.id);
    });
  });

  describe("PUT /items/:id", () => {
    it("should update an existing item", async () => {
      const item = await createMockItem();
      const itemId = item.id;

      const updatedItemData = {
        name: "Updated Test Item",
        description: "This is an updated test item",
        starting_price: 15,
        end_time: new Date().toISOString(),
      };

      const res = await request(app)
        .put(`/items/${itemId}`)
        .set("Authorization", `Bearer ${token}`)
        .field("name", updatedItemData.name)
        .field("description", updatedItemData.description)
        .field("starting_price", updatedItemData.starting_price)
        .field("end_time", updatedItemData.end_time)
        .attach("image", path.resolve(__dirname, "testImage.jpg"));

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe(updatedItemData.name);
      expect(res.body.description).toBe(updatedItemData.description);
    });
  });

  describe("DELETE /items/:id", () => {
    it("should delete an existing item", async () => {
      const item = await createMockItem();
      const itemId = item.id;

      const res = await request(app)
        .delete(`/items/${itemId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Item deleted successfully.");
    });
  });
});
