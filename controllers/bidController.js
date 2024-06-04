const { Bid, Item } = require("../models");
const NotificationService = require("../services/NotificationService");
const { emitBidEvent } = require("../websocket");

exports.getAllBids = async (req, res) => {
  const { itemId } = req;
  try {
    const item = await Item.findByPk(itemId);
    if (!item) return res.status(404).json({ error: "Item Not Found." });
    const bids = await Bid.findAll({ where: { item_id: itemId } });
    res.send(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.placeBid = async (req, res) => {
  const { itemId, user } = req;
  const userId = req.user.id;
  const { bid_amount } = req.body;

  // Basic validation
  if (!itemId || !bid_amount || isNaN(bid_amount)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found." });
    }
    // Prevent owner from bidding on their own item
    if (item.owner_id === user.id) {
      return res
        .status(403)
        .json({ error: "Owner cannot bid on their own item" });
    }

    if (parseFloat(bid_amount) <= parseFloat(item.current_price)) {
      return res
        .status(400)
        .json({ error: "Bid amount must be higher than the current price." });
    }

    const bid = await Bid.create({
      item_id: itemId,
      bidder_id: userId,
      bid_amount: bid_amount,
    });
    item.current_price = bid_amount;
    await item.save();

    // Notify previous highest bidder and item owner
    await NotificationService.notifyNewBid(itemId, req.user.id, bid_amount);

    emitBidEvent({ itemId, userId, bid_amount });
    res.status(201).json(bid);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
