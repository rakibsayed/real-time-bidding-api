"use strict";

module.exports = (sequelize, DataTypes, Model) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Item, {
        foreignKey: {
          name: "owner_id",
        },
      });
      this.hasMany(models.Bid,  {
        foreignKey: {
          name: "bidder_id",
        },
      });
      this.hasMany(models.Notification,  {
        foreignKey: {
          name: "user_id",
        },
      });
    }
  }
  User.init(
    {
      username: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      role: { type: DataTypes.STRING, defaultValue: "user" },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: false,
    }
  );
  return User;
};
