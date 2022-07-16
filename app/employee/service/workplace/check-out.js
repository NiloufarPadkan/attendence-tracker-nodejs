const WorkSchedule = require("../../../../models/WorkShedule");
const WorkPlace = require("../../../../models/Workplace");
const Employee = require("../../../../models/Employee");
const EmployeeSchedule = require("../../../../models/EmployeeSchedule");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");

exports.checkOut = async (req) => {
  let employeeId = req.Employee.id;
  let code = req.body.code;
  const TODAY_START = moment(new Date(), "YYYY-MM-DD").startOf("day");
  const TODAY_END = moment(new Date(), "YYYY-MM-DD").endOf("day");
  const NOW = moment(new Date());

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
  if (!activeWorkSchedule) {
    return "NotcheckedInBefore";
  }
  if (employee.workplace.hash !== code) {
    return "invalidQRcode";
  }

  (activeWorkSchedule.checkOutTime =
    NOW.hour() + ":" + NOW.minutes() + ":" + NOW.seconds()),
    await activeWorkSchedule.save();
  return activeWorkSchedule;
};
