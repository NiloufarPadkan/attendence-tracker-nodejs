const WorkSchedule = require("../../../../models/WorkSchedule");
const WorkPlace = require("../../../../models/Workplace");
const Employee = require("../../../../models/Employee");
const AttendanceRecords = require("../../../../models/AttendanceRecords");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
const { decrypt } = require("../../../../utils/cryproUtil");
const Leave = require("../../../../models/Leave");

exports.checkIn = async (req) => {
  const TODAY_START = moment(new Date(), "YYYY-MM-DD").startOf("day");
  const TODAY_END = moment(new Date(), "YYYY-MM-DD").endOf("day");
  const NOW = moment(new Date());
  var currentDate = moment(new Date()); //current full Date
  var currentDayName = moment(currentDate).format("dddd"); //current day of week
  var currentTime = moment(currentDate).format("HH:mm:ss"); //current full Date

  let employeeId = req.Employee.id;
  let code = req.body.code;

  let confirmedLeave = await Leave.findOne({
    where: {
      status: 1,
      employeeId: employeeId,
      startDateTime: {
        [Op.gte]: TODAY_START.format("YYYY-MM-DD HH:mm:ss").toString(),
        [Op.lte]: TODAY_END.format("YYYY-MM-DD HH:mm:ss").toString(),
      },
    },
    raw: true,
  });

  if (confirmedLeave) {
    if (confirmedLeave && confirmedLeave.type == "daily") {
      return "notInSchedule";
    } else if (confirmedLeave.type == "hourly") {
      let startLeaveTime = moment(
        new Date(confirmedLeave.startDateTime)
      ).format("HH:mm:ss");
      let endLeaveTime = moment(new Date(confirmedLeave.endDateTime)).format(
        "HH:mm:ss"
      );
      if (currentTime >= startLeaveTime && currentTime <= endLeaveTime) {
        //mohasebe inke ta alan cheghad bayad morkhassi mimoond
        return "notInSchedule";
      }
    }
  }
  let employee = await Employee.findOne({
    where: {
      id: employeeId,
    },
    include: [
      {
        model: WorkPlace,
      },
      {
        model: WorkSchedule,
      },
    ],
  });
  let workDays = employee.workdays;

  if (!workDays.includes(currentDayName)) {
    return "notInSchedule";
  }

  let activeWorkSchedule = await AttendanceRecords.findOne({
    where: {
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: TODAY_END,
      },
      checkOutTime: null,
    },
  });

  if (activeWorkSchedule) {
    return "AlreadyCheckedIn";
  }

  if (decrypt(employee.workplace.hash) !== code) {
    return "invalidQRcode";
  }

  let newCheckIn = new AttendanceRecords({
    employeeId: employeeId,
    workplaceId: employee.workplaceId,
    startTime: employee.workSchedule.startTime,
    endTime: employee.workSchedule.endTime,
    createdAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    checkInTime: NOW.hour() + ":" + NOW.minutes() + ":" + NOW.seconds(),
  });
  await newCheckIn.save();
  return newCheckIn;
};
// check if employee checked in or not
exports.checkInStatus = async (req) => {
  const TODAY_START = moment(new Date(), "YYYY-MM-DD").startOf("day");
  const TODAY_END = moment(new Date(), "YYYY-MM-DD").endOf("day");
  let employeeId = req.Employee.id;

  let activeWorkSchedule = await AttendanceRecords.findOne({
    where: {
      employeeId: employeeId,
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: TODAY_END,
      },
      checkOutTime: null,
    },
  });
  return activeWorkSchedule;
};
