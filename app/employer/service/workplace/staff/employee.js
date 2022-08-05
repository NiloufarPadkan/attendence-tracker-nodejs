const Employee = require("../../../../../models/Employee");
const AttendanceRecords = require("../../../../../models/AttendanceRecords");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
// show attandance records

exports.showPresentEmployees = async (req) => {
  const TODAY_START = moment(new Date(), "YYYY-MM-DD").startOf("day");
  const TODAY_END = moment(new Date(), "YYYY-MM-DD").endOf("day");
  let workplaceId = req.params.id;
  let presentEmployees = await AttendanceRecords.findAll({
    where: {
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: TODAY_END,
      },
      workplaceId: workplaceId,
      checkOutTime: null,
    },
    include: [{ model: Employee }],
  });
  return presentEmployees;
};
exports.indexEmployees = async (req) => {
  let workplaceId = req.params.id;
  let employees = await Employee.findAll({
    where: {
      workplaceId: workplaceId,
    },
  });
  return employees;
};

//TO DO : show absent people
