const { Notification } = require("../models");
const { errorSymbol, successSymbol } = require('../utils/consoleSymbols');

// Controller function to fetch notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id }, // Fetch notifications for the current user
    });
    res.json(notifications);
  } catch (error) {
    console.error(`${errorSymbol} Error fetching notifications:`, error);
    res.status(500).json({ error: "An error occurred while fetching notifications." });
  }
};

// Controller function to mark notifications as read
exports.markAsRead = async (req, res) => {
  try {
    let notificationIds = req.body.notification_ids || req.body.notification_id;
    // Validate input: Check if notification IDs are provided
    if (!notificationIds || (Array.isArray(notificationIds) && notificationIds.length === 0)) {
      console.log(`${errorSymbol} No notification IDs provided.`);
      return res.status(400).json({ error: "No notification IDs provided." });
    }

    // Normalize to an array
    const idsArray = Array.isArray(notificationIds) ? notificationIds : [notificationIds];

    // Ensure all IDs are valid integers
    if (!idsArray.every((id) => Number.isInteger(id))) {
      console.log(`${errorSymbol} Invalid notification IDs.`);
      return res.status(400).json({ error: "Invalid notification IDs." });
    }
    
    // Update notifications: Mark notifications as read
    const [updatedCount] = await Notification.update(
      { is_read: true }, // Set is_read field to true
      {
        where: {
          id: idsArray, // Update notifications with provided IDs
          user_id: req.user.id, // Ensure notifications belong to the current user
          is_read: false, // Only update notifications that are not already read
        },
      }
    );
    
    if (updatedCount === 0) {
      console.log(`${errorSymbol} No unread notifications found with the provided IDs`);
      return res.status(404).json({ error: "No unread notifications found with the provided IDs" });
    }

    console.log(`${successSymbol} ${updatedCount} notification(s) marked as read.`);
    return res.status(200).json({ message: `${updatedCount} notification(s) marked as read.` });
  } catch (error) {
    console.error(`${errorSymbol} Error marking notifications as read:`, error);
    return res.status(500).json({ error: "An error occurred while marking notifications as read." });
  }
};
