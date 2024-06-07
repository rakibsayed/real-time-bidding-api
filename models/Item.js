"use strict";

// Exporting a function that defines the Item model
module.exports = (sequelize, DataTypes, Model) => {
  // Define the Item class that extends the Sequelize Model class
  class Item extends Model {
    // Define associations with other models
    static associate(models) {
      // Item belongs to a User (owner)
      this.belongsTo(models.User, {
        foreignKey: {
          name: "owner_id", // Foreign key to link the owner
          allowNull: false, // Owner ID cannot be null
        },
        onDelete: "CASCADE", // If a user is deleted, delete all their items
        onUpdate: "CASCADE", // If a user's ID is updated, update their ID in items too
      });
      // Item has many Bids
      this.hasMany(models.Bid, {
        foreignKey: { name: "item_id" }, // Foreign key to link the item
      });
    }
  }

  // Initialize the Item model with attributes and options
  Item.init(
    {
      name: { type: DataTypes.STRING, allowNull: false }, // Name of the item
      description: { type: DataTypes.TEXT, allowNull: false }, // Description of the item
      starting_price: { type: DataTypes.DECIMAL, allowNull: false }, // Starting price of the item
      current_price: {
        type: DataTypes.DECIMAL,
        defaultValue: 0.0, // Default current price is 0.0
      },
      image_url: { type: DataTypes.STRING }, // URL of the item's image
      end_time: { type: DataTypes.DATE, allowNull: false }, // End time of the item's auction
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // Default value for the creation date
    },
    {
      sequelize, // Sequelize instance
      modelName: "Item", // Model name
      timestamps: false, // Disable timestamps
    }
  );

  return Item; // Return the Item model
};
