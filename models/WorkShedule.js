const Sequelize = require("sequelize");

const sequelize = require("../config/database/sequelize");
const Employee = require("./Employee");
const Workplace = require("./Workplace");

const WorkShedule = sequelize.define("workShedule", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  startTime: {
    type: Sequelize.TIME,
  },
  endTime: {
    type: Sequelize.TIME,
  },
  title: {
    type: Sequelize.STRING,
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

Employee.belongsTo(WorkShedule);
WorkShedule.belongsTo(Workplace);
module.exports = WorkShedule;
