const Employee = require("../../../../../models/Employee");
const AttendanceRecords = require("../../../../../models/AttendanceRecords");
let attandanceHistoryService = require("../../../../../services/attendanceHistory");

const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
// show attandance records

exports.showPresentEmployees = async (req) => {
  const limit = req.query.size ? req.query.size : 10;
  const offset = req.query.page ? req.query.page * limit : 0;
  const TODAY_START = moment(new Date(), "YYYY-MM-DD").startOf("day");
  const TODAY_END = moment(new Date(), "YYYY-MM-DD").endOf("day");
  let workplaceId = req.params.id;
  let presentEmployees = await AttendanceRecords.findAndCountAll({
    where: {
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: TODAY_END,
      },
      workplaceId: workplaceId,
      checkOutTime: null,
    },
    limit: parseInt(limit),
    offset: parseInt(offset),
    include: [{ model: Employee }],
  });
  let pages = Math.ceil(presentEmployees.count / limit);

  let result = {
    count: presentEmployees.count,
    pages: pages,
    presentEmployees: presentEmployees.rows,
  };
  return result;
};

exports.indexEmployees = async (req) => {
  let workplaceId = req.params.id;

  const limit = req.query.size ? req.query.size : 10;
  const offset = req.query.page ? req.query.page * limit : 0;

  let employees = await Employee.findAndCountAll({
    where: {
      workplaceId: workplaceId,
    },
    limit: parseInt(limit),
    offset: parseInt(offset),
  });
  let pages = Math.ceil(employees.count / limit);

  let result = {
    count: employees.count,
    pages: pages,
    employees: employees.rows,
  };
  return result;
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
  let history = await AttendanceRecords.findAndCountAll({
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

  let pages = Math.ceil(history.count / limit);

  let result = {
    count: history.count,
    pages: pages,
    history: history.rows,
  };
  return result;
};

exports.attendanceByDate = async (req) => {
  let employeeId = req.params.id;
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  const beginningOfDay = moment(startDate, "YYYY-MM-DD").startOf("day");
  const endOfDay = moment(endDate, "YYYY-MM-DD").endOf("day");
  const limit = req.query.size ? req.query.size : 10;
  const offset = req.query.page ? req.query.page * limit : 0;

  let history = await AttendanceRecords.findAndCountAll({
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
  let pages = Math.ceil(history.count / limit);

  let result = {
    count: history.count,
    pages: pages,
    history: history.rows,
  };
  return result;
};
//TO DO : show absent people
