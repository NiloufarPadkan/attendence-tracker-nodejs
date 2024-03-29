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

  hash: {
    type: Sequelize.TEXT,
    get: function () {
      if (this.getDataValue("hash"))
        return JSON.parse(this.getDataValue("hash"));
      else {
        return "";
      }
    },
    set: function (value) {
      this.setDataValue("hash", JSON.stringify(value));
    },
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
