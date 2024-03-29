const Sequelize = require("sequelize");
const sequelize = require("../config/database/sequelize");
const Role = sequelize.define("role", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
    trim: true,
    unique: true,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.DATE,
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.DATE,
  },
});

module.exports = Role;
