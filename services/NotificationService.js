const { User, Notification, Bid } = require("../models");
const { errorSymbol } = require('../utils/consoleSymbols');

exports.notifyNewBid = async (itemId, userId, bidAmount) => {
  try {
    // Fetch previous highest bid
    const previousBids = await Bid.findAll({
      where: { item_id: itemId },
      order: [["bid_amount", "DESC"]],
      offset: 1, // Skip the first bid, which is the latest user bid
      limit: 1,
    });

    const previousHighestBid = previousBids[0];

    // Notify the outbid user if there was a previous highest bid
    if (previousHighestBid) {
      const outbidUser = await User.findByPk(previousHighestBid.bidder_id);
      if (outbidUser) {
        const notification = await Notification.create({
          user_id: outbidUser.id,
          message: `You have been outbid on item ${itemId}`,
        });
        return {
          message: notification.message,
          recipientId: notification.user_id,
        };
      } else {
        console.error(`${errorSymbol} Outbid user not found`);
      }
    }

    // Notify the item owner if there was no previous highest bid
    const itemOwner = await User.findByPk(userId);
    if (itemOwner) {
      const notification = await Notification.create({
        user_id: itemOwner.id,
        message: `Your item ${itemId} has a new highest bid of ${bidAmount}`,
      });
      return {
        message: notification.message,
        recipientId: notification.user_id,
      };
    } else {
      console.error(`${errorSymbol} Item owner not found`);
    }
  } catch (error) {
    console.error(`${errorSymbol} Error processing bid notification:`, error);
  }
};
