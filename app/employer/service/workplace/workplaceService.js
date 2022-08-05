const Employee = require("../../../../models/Employee");
const AttendanceRecords = require("../../../../models/AttendanceRecords");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Workplace = require("../../../../models/Workplace");
const WorkSchedule = require("../../../../models/WorkSchedule");

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
  let newWorkPlace = new WorkSchedule({
    title,
    startTime,
    endTime,
    workplaceId,
  });
  await newWorkPlace.save();
  return newWorkPlace;
};
exports.indexWorkSchedules = async (req) => {
  let workplaceId = req.params.id;
  let workSchedules = await WorkSchedule.findAll({
    where: {
      workplaceId,
    },
  });
  return workSchedules;
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

//TO DO : show absent people
