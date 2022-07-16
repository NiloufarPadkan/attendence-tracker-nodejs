const Sequelize = require("sequelize");
const sequelize = require("../config/database/sequelize");
const Employee = require("./Employee");
const Workplace = require("./Workplace");
const EmployeeSchedule = sequelize.define("employeeSchedule", {
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
  checkInTime: {
    type: Sequelize.TIME,
  },
  checkOutTime: {
    type: Sequelize.TIME,
  },
});
EmployeeSchedule.belongsTo(Employee);
EmployeeSchedule.belongsTo(Workplace);

module.exports = EmployeeSchedule;
