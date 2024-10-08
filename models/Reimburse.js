const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Reimburse = sequelize.define(
  "reimburse",
  {
    purpose_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purpose_other: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    category: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    approval_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    approval_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Reimburse;
