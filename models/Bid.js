"use strict";

// Exporting a function that defines the Bid model
module.exports = (sequelize, DataTypes, Model) => {
  // Define the Bid class that extends the Sequelize Model class
  class Bid extends Model {
    // Define associations with other models
    static associate(models) {
      // Bid belongs to a User
      this.belongsTo(models.User, {
        foreignKey: { name: "bidder_id", allowNull: false }, // Foreign key to link the bidder
        onDelete: "CASCADE", // If a user is deleted, delete all their bids
        onUpdate: "CASCADE", // If a user's ID is updated, update their ID in bids too
      });
      // Bid belongs to an Item
      this.belongsTo(models.Item, {
        foreignKey: { name: "item_id", allowNull: false }, // Foreign key to link the item
        onDelete: "CASCADE", // If an item is deleted, delete all bids associated with it
        onUpdate: "CASCADE", // If an item's ID is updated, update its ID in bids too
      });
    }
  }

  // Initialize the Bid model with attributes and options
  Bid.init(
    {
      bid_amount: {
        type: DataTypes.DECIMAL, // Bid amount is stored as DECIMAL type
        allowNull: false, // Bid amount cannot be null
        validate: { min: 0 }, // Bid amount must be a positive number
      },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // Default value for the creation date
    },
    { sequelize, modelName: "Bid", timestamps: false } // Define sequelize instance, model name, and disable timestamps
  );

  return Bid; // Return the Bid model
};
