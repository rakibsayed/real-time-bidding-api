"use strict";

// Exporting a function that defines the Notification model
module.exports = (sequelize, DataTypes, Model) => {
  // Define the Notification class that extends the Sequelize Model class
  class Notification extends Model {
    // Define associations with other models
    static associate(models) {
      // Notification belongs to a User
      this.belongsTo(models.User, {
        foreignKey: {
          name: "user_id", // Foreign key to link the user
          allowNull: false, // User ID cannot be null
        },
        onDelete: "CASCADE", // If a user is deleted, delete all their notifications
        onUpdate: "CASCADE", // If a user's ID is updated, update their ID in notifications too
      });
    }
  }

  // Initialize the Notification model with attributes and options
  Notification.init(
    {
      message: { type: DataTypes.STRING, allowNull: false }, // Message of the notification
      is_read: { type: DataTypes.BOOLEAN, defaultValue: false }, // Boolean flag indicating if the notification is read
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // Default value for the creation date
    },
    {
      sequelize, // Sequelize instance
      modelName: "Notification", // Model name
      timestamps: false, // Disable timestamps
    }
  );

  return Notification; // Return the Notification model
};
