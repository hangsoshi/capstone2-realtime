const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "notification",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      receiver_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      content: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "none",
      },
    },
    {
      sequelize,
      tableName: "notification",
      underscored: true,
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "notification_receiver_id_foreign",
          using: "BTREE",
          fields: [{ name: "receiver_id" }],
        },
      ],
    }
  );
};
