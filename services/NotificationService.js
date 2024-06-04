const { User, Notification, Bid } = require("../models");

exports.notifyNewBid = async (itemId, userId, bidAmount) => {
  try {
    // Fetch previous bids
    const previousBids = await Bid.findAll({
      where: { item_id: itemId },
      order: [["bid_amount", "DESC"]],
      offset: 1, // First Bid Will be Latest User Bid So Need to Skip That
      limit: 1,
    });

    const previousHighestBid = previousBids[0];

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
        console.error("Outbid user not found");
      }
    }

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
      console.error("Item owner not found");
    }
  } catch (error) {
    console.error("Error processing bid notification:", error);
  }
};
