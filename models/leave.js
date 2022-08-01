const Sequelize = require("sequelize");
const sequelize = require("../config/database/sequelize");
const Employee = require("./Employee");
const Workplace = require("./Workplace");
const moment = require("moment");

const Leave = sequelize.define(
  "leave",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    startDateTime: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    endDateTime: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    status: {
      //apporoved or not
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      set: function (val) {
        if (val === 1) return this.setDataValue("status", true);
        else return this.setDataValue("status", false);
      },
    },
  },
  {
    timestamps: false,
  }
);
Leave.belongsTo(Employee);
Leave.belongsTo(Workplace);

module.exports = Leave;
