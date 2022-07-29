const Sequelize = require("sequelize");
const sequelize = require("../config/database/sequelize");
const Employee = require("./Employee");
const Workplace = require("./Workplace");
const moment = require("moment");

const AttendanceRecords = sequelize.define(
  "attendanceRecords",
  {
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
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      get: function () {
        console.log(new Date());

        var isoDateString = new Date(this.getDataValue("createdAt"));
        return new Date(
          isoDateString.getTime() -
            isoDateString.getTimezoneOffset() * 60 * 1000
        );
      },
      //   set: function (val) {
      //     console.log(new Date());
      //     return new Date();
      //   },
    },
    // updatedAt: {
    //   type: Sequelize.DATE,
    //   defaultValue: new Date(),
    //   get: function () {
    //     var isoDateString = new Date(this.getDataValue("updatedAt"));
    //     return new Date(
    //       isoDateString.getTime() -
    //         isoDateString.getTimezoneOffset() * 60 * 1000
    //     );
    //   },
    // },
  },
  {
    timestamps: false,
  }
);
AttendanceRecords.belongsTo(Employee);
AttendanceRecords.belongsTo(Workplace);

module.exports = AttendanceRecords;
