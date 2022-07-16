const WorkSchedule = require("../../../../models/WorkShedule");
const WorkPlace = require("../../../../models/Workplace");
const Employee = require("../../../../models/Employee");
const EmployeeSchedule = require("../../../../models/EmployeeSchedule");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");

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

  let activeWorkSchedule = await EmployeeSchedule.findOne({
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
  if (employee.workplace.hash !== code) {
    return "invalidQRcode";
  }

  let newCheckIn = new EmployeeSchedule({
    employeeId: employeeId,
    workplaceId: employee.workplaceId,
    startTime: employee.workShedule.startTime,
    endTime: employee.workShedule.endTime,
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

  let activeWorkSchedule = await EmployeeSchedule.findOne({
    where: {
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: TODAY_END,
      },
      checkOutTime: null,
    },
  });
  return activeWorkSchedule;
};
