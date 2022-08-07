const Employee = require("../../../../models/Employee");
const AttendanceRecords = require("../../../../models/AttendanceRecords");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Workplace = require("../../../../models/Workplace");
const WorkSchedule = require("../../../../models/WorkSchedule");
const moment = require("moment");

exports.addWorkPlace = async (req) => {
  let name = req.body.name;
  let newWorkPlace = new Workplace({
    name: name,
    employerId: req.Employer.id,
  });
  await newWorkPlace.save();
  return newWorkPlace;
};
exports.indexWorkPlaces = async (req) => {
  let workplaces = await Workplace.findAll({
    where: {
      employerId: req.Employer.id,
    },
  });
  return workplaces;
};

exports.addWorkSchedule = async (req) => {
  let startTime = req.body.startTime;
  let endTime = req.body.endTime;
  let title = req.body.title;
  let workplaceId = req.params.id;
  let newWchedule = new WorkSchedule({
    title,
    startTime,
    endTime,
    workplaceId,
  });
  await newWchedule.save();
  return newWchedule;
};
exports.indexWorkSchedules = async (req) => {
  let workplaceId = req.params.id;
  const limit = req.query.size ? req.query.size : 10;
  const offset = req.query.page ? req.query.page * limit : 0;

  let workSchedules = await WorkSchedule.findAndCountAll({
    where: {
      workplaceId,
    },
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  let pages = Math.ceil(workSchedules.count / limit);

  let result = {
    count: workSchedules.count,
    pages: pages,
    workSchedules: workSchedules.rows,
  };
  return result;
};

exports.addEmployeeToWorkplace = async (req) => {
  let employeePhoneNumber = req.body.employeePhoneNumber;
  let employee = await Employee.findOne({
    where: {
      phone: employeePhoneNumber,
    },
  });
  if (!employee) {
    return "employeeNotFound";
  }
  employee.workplaceId = req.params.id;
  employee.workScheduleId = req.body.workScheduleId;
  employee.workdays = req.body.workdays;
  await employee.save();

  return employee;
};

exports.workplaceRecentAttendance = async (req) => {
  let workplaceId = req.params.id;
  const limit = req.query.size ? req.query.size : 10;
  const offset = req.query.page ? req.query.page * limit : 0;
  let history = await AttendanceRecords.findAndCountAll({
    where: {
      workplaceId: workplaceId,
    },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["createdAt", "DESC"]],
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
exports.workplaceAttendanceByDate = async (req) => {
  let workplaceId = req.params.id;
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  const beginningOfDay = moment(startDate, "YYYY-MM-DD").startOf("day");
  const endOfDay = moment(endDate, "YYYY-MM-DD").endOf("day");
  const limit = req.query.size ? req.query.size : 10;
  const offset = req.query.page ? req.query.page * limit : 0;

  let history = await AttendanceRecords.findAndCountAll({
    where: {
      workplaceId: workplaceId,
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
