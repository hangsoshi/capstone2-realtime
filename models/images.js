const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "images",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      image_url: {
        type: DataTypes.STRING(2048),
        allowNull: true,
      },
      tour_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "tours",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "images",
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
          name: "images_tour_id_foreign",
          using: "BTREE",
          fields: [{ name: "tour_id" }],
        },
      ],
    }
  );
};
