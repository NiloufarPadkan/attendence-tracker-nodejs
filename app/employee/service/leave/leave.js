const Leave = require("../../../../models/Leave");
const Employee = require("../../../../models/Employee");
const WorkSchedule = require("../../../../models/WorkSchedule");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");

exports.leaveRequest = async (req) => {
  //prevent mutiple request
  try {
    let description = req.body.description;
    let employee = req.Employee;
    let startDateTime = req.body.startDateTime;
    let endDateTime = req.body.endDateTime;
    let type = req.body.type;

    employee = await Employee.findOne({
      where: {
        id: req.Employee.id,
      },
      include: [
        {
          model: WorkSchedule,
        },
      ],
    });

    if (type === "daily") {
      if (
        !employee.workdays.includes(
          moment(new Date(startDateTime)).format("dddd")
        )
      ) {
        return "notInSchedule";
      }
    } else {
      startTime = moment(new Date(startDateTime)).format("HH:mm:ss");
      endTime = moment(new Date(endDateTime)).format("HH:mm:ss");
      if (
        startTime < employee.workSchedule.startTime ||
        startTime > employee.workSchedule.endTime ||
        endTime < employee.workSchedule.startTime ||
        endTime > employee.workSchedule.endTime
      )
        return "notInSchedule";
    }
    let newLeaveRequest = new Leave({
      description,
      startDateTime,
      endDateTime,
      employeeId: employee.id,
      workplaceId: employee.workplaceId,
      type,
    });
    await newLeaveRequest.save();
    return newLeaveRequest;
  } catch (error) {
    throw new Error(error);
  }
};
exports.indexLeaves = async (req) => {
  try {
    const limit = req.query.size ? req.query.size : 3;
    const offset = req.query.page ? req.query.page * limit : 0;
    let leaves = await Leave.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),

      where: {
        employeeId: req.Employee.id,
      },
    });
    return leaves;
  } catch (error) {
    throw new Error(error);
  }
};
