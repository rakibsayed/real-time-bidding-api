"use strict";

module.exports = (sequelize, DataTypes , Model) => {
  class Notification extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          name:"user_id",
          allowNull:false
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  Notification.init(
    {
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Notification",
      timestamps: false,
    }
  );

  return Notification;
};
