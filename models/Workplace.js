const Sequelize = require("sequelize");

const sequelize = require("../config/database/sequelize");
const Employee = require("./Employee");
const Employer = require("./Employer");

const Workplace = sequelize.define("workplace", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    trim: true,
    unique: true,
  },
  QRcode: {
    type: Sequelize.STRING,
  },
  hash: {
    type: Sequelize.STRING,
    trim: true,
  },
  activityStatus: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    set: function (val) {
      if (val === 1) return this.setDataValue("activityStatus", true);
      else return this.setDataValue("activityStatus", false);
    },
  },
});

Employee.belongsTo(Workplace);
Employer.hasOne(Workplace);
module.exports = Workplace;
