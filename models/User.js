"use strict";

// Exporting a function that defines the User model
module.exports = (sequelize, DataTypes, Model) => {
  // Define the User class that extends the Sequelize Model class
  class User extends Model {
    // Define associations with other models
    static associate(models) {
      // User has many Items (user_id is the foreign key in Item)
      this.hasMany(models.Item, {
        foreignKey: {
          name: "owner_id", // Foreign key to link the owner of the item
        },
      });
      // User has many Bids (bidder_id is the foreign key in Bid)
      this.hasMany(models.Bid, {
        foreignKey: {
          name: "bidder_id", // Foreign key to link the bidder of the bid
        },
      });
      // User has many Notifications (user_id is the foreign key in Notification)
      this.hasMany(models.Notification, {
        foreignKey: {
          name: "user_id", // Foreign key to link the user of the notification
        },
      });
    }
  }

  // Initialize the User model with attributes and options
  User.init(
    {
      username: { type: DataTypes.STRING, unique: true, allowNull: false }, // Username of the user (must be unique and not null)
      password: { type: DataTypes.STRING, allowNull: false }, // Password of the user (not null)
      email: { type: DataTypes.STRING, unique: true, allowNull: false }, // Email of the user (must be unique and not null)
      role: { type: DataTypes.STRING, defaultValue: "user" }, // Role of the user (default is "user")
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // Default value for the creation date
    },
    {
      sequelize, // Sequelize instance
      modelName: "User", // Model name
      timestamps: false, // Disable timestamps
    }
  );

  return User; // Return the User model
};
