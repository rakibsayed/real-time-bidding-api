"use strict";

module.exports = (sequelize, DataTypes, Model) => {
  class Item extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          name: "owner_id",
          allowNull: false,
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.hasMany(models.Bid ,{foreignKey: {
        name: "item_id"
      }});
    }
  }
  Item.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      starting_price: { type: DataTypes.DECIMAL, allowNull: false },
      current_price: {
        type: DataTypes.DECIMAL,
        defaultValue: 0.0,
      },
      image_url: { type: DataTypes.STRING },
      end_time: { type: DataTypes.DATE, allowNull: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: "Item",
      timestamps: false,
    }
  );
  return Item;
};
