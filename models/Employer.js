const Sequelize = require("sequelize");

const sequelize = require("../config/database/sequelize");
const Role = require("./Role");

const Employer = sequelize.define("employer", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    trim: true,
    unique: true,
  },
  fname: {
    type: Sequelize.STRING,
    trim: true,
  },
  lname: {
    type: Sequelize.STRING,
    trim: true,
  },
  phone: {
    type: Sequelize.STRING,
    trim: true,
    unique: true,
  },
  otp: {
    type: Sequelize.STRING,
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

Employer.belongsTo(Role);
module.exports = Employer;
