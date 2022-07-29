const WorkSchedule = require("../../../../models/WorkShedule");
const WorkPlace = require("../../../../models/Workplace");
const Employee = require("../../../../models/Employee");
const AttendanceRecords = require("../../../../models/AttendanceRecords");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
const { decrypt } = require("../../../../utils/cryproUtil");

exports.checkIn = async (req) => {
  const TODAY_START = moment(new Date(), "YYYY-MM-DD").startOf("day");
  const TODAY_END = moment(new Date(), "YYYY-MM-DD").endOf("day");
  const NOW = moment(new Date());

  let employeeId = req.Employee.id;
  let code = req.body.code;

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
  // console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));

  let newCheckIn = new AttendanceRecords({
    employeeId: employeeId,
    workplaceId: employee.workplaceId,
    startTime: employee.workShedule.startTime,
    endTime: employee.workShedule.endTime,
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
