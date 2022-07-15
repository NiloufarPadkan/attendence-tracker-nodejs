const Sequelize = require("sequelize");

const sequelize = require("../config/database/sequelize");
const Role = require("./Role");

const Employee = sequelize.define("employee", {
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
    defaultValue: false,
    set: function (val) {
      if (val === 1) return this.setDataValue("activityStatus", true);
      else return this.setDataValue("activityStatus", false);
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.DATE,
    },
  },
});

Employee.belongsTo(Role);
module.exports = Employee;
