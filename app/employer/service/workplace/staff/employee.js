const Employee = require("../../../../../models/Employee");
const AttendanceRecords = require("../../../../../models/AttendanceRecords");
let attandanceHistoryService = require("../../../../../services/attendanceHistory");

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

exports.dailyHistory = async (req) => {
  let history = attandanceHistoryService.dailyHistory(req.params.id);
  return history;
};
exports.getHistoryByDate = async (req) => {
  let employeeId = req.params.id;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  let history = attandanceHistoryService.getHistoryByDate(
    employeeId,
    startDate,
    endDate
  );
  return history;
};

exports.recentAttendance = async (req) => {
  let employeeId = req.params.id;
  const limit = req.query.size ? req.query.size : 10;
  const offset = req.query.page ? req.query.page * limit : 0;
  let history = await AttendanceRecords.findAll({
    where: {
      employeeId: employeeId,
    },
    limit: parseInt(limit),
    offset: parseInt(offset),
    include: [
      {
        model: Employee,
        attributes: ["fname", "lname"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  return history;
};

exports.attendanceByDate = async (req) => {
  let employeeId = req.params.id;
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  const beginningOfDay = moment(startDate, "YYYY-MM-DD").startOf("day");
  const endOfDay = moment(endDate, "YYYY-MM-DD").endOf("day");
  const limit = req.query.size ? req.query.size : 10;
  const offset = req.query.page ? req.query.page * limit : 0;

  let history = await AttendanceRecords.findAll({
    where: {
      employeeId: employeeId,
      createdAt: {
        [Op.gte]: beginningOfDay,
        [Op.lte]: endOfDay,
      },
    },
    limit: parseInt(limit),
    offset: parseInt(offset),
    include: [
      {
        model: Employee,
        attributes: ["fname", "lname"],
      },
    ],
  });
  return history;
};
//TO DO : show absent people
