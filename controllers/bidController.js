const { Bid, Item } = require("../models");
const NotificationService = require("../services/NotificationService");
const { emitBidEvent } = require("../websocket");
const { errorSymbol, successSymbol } = require("../utils/consoleSymbols");

// Controller function to fetch all bids for a particular item
exports.getAllBids = async (req, res) => {
  const { itemId } = req;
  try {
    // Find the item by its ID
    const item = await Item.findByPk(itemId);
    if (!item) {
      console.log(`${errorSymbol} Item Not Found.`);
      return res.status(404).json({ error: "Item Not Found." });
    }
    // Fetch all bids associated with the item
    const bids = await Bid.findAll({ where: { item_id: itemId } });
    console.log(`${successSymbol} Fetched all bids successfully.`);
    res.send(bids);
  } catch (error) {
    console.error(`${errorSymbol} Error fetching bids:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

// Controller function to place a bid on an item
exports.placeBid = async (req, res) => {
  const { itemId, user } = req;
  const userId = req.user.id;
  const { bid_amount } = req.body;

  // Basic validation: Check for valid input
  if (!itemId || !bid_amount || isNaN(bid_amount)) {
    console.log(`${errorSymbol} Invalid input`);
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    // Find the item by its ID
    const item = await Item.findByPk(itemId);
    if (!item) {
      console.log(`${errorSymbol} Item not found.`);
      return res.status(404).json({ error: "Item not found." });
    }
    // Prevent owner from bidding on their own item
    if (item.owner_id === user.id) {
      console.log(`${errorSymbol} Owner cannot bid on their own item`);
      return res
        .status(403)
        .json({ error: "Owner cannot bid on their own item" });
    }

    // Ensure bid amount is higher than the current price
    if (parseFloat(bid_amount) <= parseFloat(item.current_price)) {
      console.log(
        `${errorSymbol} Bid amount must be higher than the current price.`
      );
      return res
        .status(400)
        .json({ error: "Bid amount must be higher than the current price." });
    }

    // Check if the highest bid is from the same user
    const highestBid = await Bid.findOne({
      where: { item_id: itemId },
      order: [["bid_amount", "DESC"]],
    });

    if (highestBid && highestBid.bidder_id === userId) {
      console.log(`${errorSymbol} You already have the highest bid.`);
      return res
        .status(400)
        .json({ error: "You already have the highest bid." });
    }

    // Create a new bid
    const bid = await Bid.create({
      item_id: itemId,
      bidder_id: userId,
      bid_amount: bid_amount,
    });
    // Update the current price of the item
    item.current_price = bid_amount;
    await item.save();

    // Notify previous highest bidder and item owner about the new bid
    await NotificationService.notifyNewBid(itemId, req.user.id, bid_amount);

    // Emit bid event for real-time updates
    emitBidEvent({ itemId, userId, bid_amount });
    console.log(`${successSymbol} Bid placed successfully.`);
    res.status(201).json(bid);
  } catch (error) {
    console.error(`${errorSymbol} Error placing bid:`, error.message);
    res.status(400).json({ error: error.message });
  }
};
