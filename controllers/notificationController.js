const { Notification } = require("../models");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
    });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications: ", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching notifications." });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    let notificationIds = req.body.notification_ids || req.body.notification_id;
    // Validate input
    if (
      !notificationIds ||
      (Array.isArray(notificationIds) && notificationIds.length === 0)
    ) {
      return res.status(400).json({ error: "No notification IDs provided." });
    }

    // Normalize to an array
    const idsArray = Array.isArray(notificationIds)
      ? notificationIds
      : [notificationIds];

      // Ensure all IDs are valid integers  depends what datatype youre using for the Id
      if (!idsArray.every((id) => Number.isInteger(id))) {
        return res.status(400).json({ error: "Invalid notification IDs." });
    }
    
    // Update notifications
    console.log(idsArray , req.user.id);
    const notification = await Notification.findAll({})
    console.log(notification);
    const [updatedCount] = await Notification.update(
      { is_read: true },
      {
        where: {
          id: idsArray,
          user_id: req.user.id, // Ensure the notifications belong to the current user
          is_read: false, // Only update notifications that are not already read
        },
      }
    );
    
    if (updatedCount === 0) {
      console.log(idsArray , req.user.id);
      return res
      .status(404)
        .json({ error: "No unread notifications found with the provided IDs" });
    }

    return res
      .status(200)
      .json({ message: `${updatedCount} notification(s) marked as read.` });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while marking notifications as read." });
  }
};
