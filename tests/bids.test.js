const { Server } = require("http");
const ioClient = require("socket.io-client");
const request = require("supertest");
const app = require("../app");
const { Bid, Item, User } = require("../models");
const jwt = require("jsonwebtoken");
const { createMockUser, createMockItem } = require("../testUtils/mockData");
const { startSocketServer } = require("../websocket");
const { errorSymbol, successSymbol } = require('../utils/consoleSymbols');

describe("Bid Controller with Websocket", () => {
  let server;
  let io;
  let clientSocket;
  let ownerToken;
  let itemId;
  let ownerId;
  let itemCurrentBid;

  beforeAll(async () => {
    await User.sync({ force: true });
    await Item.sync({ force: true });
    await Bid.sync({ force: true });

    const owner = await createMockUser({
      username: "TestOwner1",
      email: "owner@email.com",
    });
    ownerToken = jwt.sign(
      { id: owner.id, username: owner.username },
      process.env.JWT_SECRET
    );
    ownerId = owner.id;

    const item = await createMockItem(ownerId);
    itemId = item.id;
    itemCurrentBid = parseFloat(item.current_price);
  });

  beforeEach(async () => {
    await Bid.destroy({ where: {} });
  });

  afterAll(async () => {
    await Bid.destroy({ where: {} });
    await Item.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  describe("GET /items/:itemId/bids", () => {
    it("should return all bids for a specific item", async () => {
      const bid = await Bid.create({
        bid_amount: 20,
        bidder_id: 1,
        item_id: itemId,
      });
      const res = await request(app).get(`/items/${itemId}/bids`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      const receivedBid = res.body.find(
        (receivedBid) => receivedBid.id === bid.id
      );
      expect(receivedBid).toBeTruthy();
    });
  });

  describe("POST /items/:itemId/bids", () => {
    it("should create a new bid", async () => {
      server = Server(app);
      io = startSocketServer(server);

      const TEST_PORT = process.env.TEST_PORT || 4000;
      await new Promise((resolve) => {
        server.listen(TEST_PORT, () => {
          clientSocket = ioClient(`http://localhost:${TEST_PORT}`);
          clientSocket.on("connect", () => {
            expect(clientSocket.connected).toBeTruthy();
            resolve();
          });
        });
      });

      const bidder = await createMockUser({
        username: "TestBidder1",
        email: "bidder@email.com",
      });
      const bidderToken = jwt.sign(
        { id: bidder.id, username: bidder.username },
        process.env.JWT_SECRET
      );
      
      const newBidAmount = itemCurrentBid + 20;
      await new Promise((resolve) => {
        clientSocket.on("bid_update", async (data) => {
          try {
            expect(data).toHaveProperty("itemId");
            expect(data).toHaveProperty("bidAmount");
            expect(data).toHaveProperty("userId");
            expect(data).toHaveProperty("message");
            resolve();
          } catch (error) {
            done(error);
          }
        });

        request(app)
          .post(`/items/${itemId}/bids`)
          .set("Authorization", `Bearer ${bidderToken}`)
          .send({ bid_amount: newBidAmount })
          .expect(201)
          .end((err) => {
            if (err) resolve(err);
          });
      });

      clientSocket.close();
      io.close();
      server.close();
    }, 5000);
  });
});
