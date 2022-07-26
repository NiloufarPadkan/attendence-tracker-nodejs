const Sequelize = require("sequelize");
const sequelize = require("../config/database/sequelize");
const Employee = require("./Employee");
const Workplace = require("./Workplace");
const AttendanceRecords = sequelize.define("attendanceRecords", {
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
AttendanceRecords.belongsTo(Employee);
AttendanceRecords.belongsTo(Workplace);

module.exports = AttendanceRecords;
