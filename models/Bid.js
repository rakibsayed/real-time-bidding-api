"use strict";

module.exports = (sequelize, DataTypes, Model) => {
  class Bid extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: { name: "bidder_id", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsTo(models.Item, {
        foreignKey: { name: "item_id", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  Bid.init(
    {
      bid_amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: { min: 0 },
      },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, modelName: "Bid", timestamps: false }
  );

  return Bid;
};
