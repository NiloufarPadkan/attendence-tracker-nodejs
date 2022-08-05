const Sequelize = require("sequelize");

const sequelize = require("../config/database/sequelize");
const Employee = require("./Employee");
const Workplace = require("./Workplace");

const WorkSchedule = sequelize.define("workSchedule", {
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
});

Employee.belongsTo(WorkSchedule);
WorkSchedule.belongsTo(Workplace);
module.exports = WorkSchedule;
