const Sequelize = require("sequelize");
const moment = require("moment");
const Employee = require("../../../../models/Employee");
const AttendanceRecords = require("../../../../models/AttendanceRecords");
const Op = Sequelize.Op;

exports.dailyHistory = async (req) => {
  let employeeId = req.Employee.id;
  var currentDate = moment(new Date()); //current full Date
  var currentTime = moment(currentDate).format("HH:mm:ss"); //current full Date
  var weekDayName = moment(currentDate).format("dddd"); //current day of week
  const beginningOfDay = moment(currentDate, "YYYY-MM-DD").startOf("day");
  const endOfDay = moment(currentDate, "YYYY-MM-DD").endOf("day");
  let record = { presence: "00:00:00", absence: "00:00:00", delay: "00:00:00" };
  let presenceDuration = 0;
  let scheduledPresense = 0;
  let absenseDuration = 0;
  let delayDuration = 0;

  let employee = await Employee.findOne({
    where: {
      id: employeeId,
    },
  });
  if (!employee) return "employeeNotFound";
  let workDays = employee.workdays;
  if (workDays.includes(weekDayName)) {
    let history = await AttendanceRecords.findAll({
      where: {
        employeeId: employeeId,
        createdAt: {
          [Op.gte]: beginningOfDay,
          [Op.lte]: endOfDay,
        },
      },
      order: [["createdAt", "ASC"]],
    });

    if (!history) return record;
    let workTime;
    if (currentTime > history[0].endTime)
      workTime = moment(history[0].endTime, "HH:mm:ss").diff(
        moment(history[0].startTime, "HH:mm:ss")
      );
    else {
      workTime = moment(currentTime, "HH:mm:ss").diff(
        moment(history[0].startTime, "HH:mm:ss")
      );
    }
    let delay = moment(history[0].checkInTime, "HH:mm:ss").diff(
      moment(history[0].startTime, "HH:mm:ss")
    );

    record.delay = moment.utc(delay).format("HH:mm:ss");

    history.forEach((element) => {
      if (element.checkInTime < element.endTime) {
        //scheduled presense calculation
        if (!element.checkOutTime) {
          scheduledPresense += moment
            .duration(currentDate.format("HH:mm:ss"))
            .subtract(moment.duration(element.checkInTime));
        } else if (element.checkOutTime > element.endTime) {
          scheduledPresense += moment
            .duration(element.endTime)
            .subtract(moment.duration(element.checkInTime));
        } else {
          scheduledPresense += moment
            .duration(element.checkOutTime)
            .subtract(moment.duration(element.checkInTime));
        }
      }
      if (!element.checkOutTime) {
        presenceDuration += moment
          .duration(currentDate.format("HH:mm:ss"))
          .subtract(moment.duration(element.checkInTime));
      } else {
        presenceDuration += moment
          .duration(element.checkOutTime)
          .subtract(moment.duration(element.checkInTime));
      }
      absenseDuration += moment(workTime).diff(moment(scheduledPresense));
    });
    // presenceDuration = moment.duration(presenceDuration);
    // scheduledPresense = moment.duration(scheduledPresense);
    record.presence = moment.utc(presenceDuration).format("HH:mm:ss");
    record.absence = moment.utc(absenseDuration).format("HH:mm:ss");
    return record;
  }
};
exports.getHistoryByDate = async (req) => {
  const listDate = [];
  let employeeId = req.Employee.id;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  var currentDate = moment(new Date()); //current full Date
  var currentTime = moment(currentDate).format("HH:mm:ss"); //current full Date
  let record = { presence: "00:00:00", absence: "00:00:00", delay: "00:00:00" };
  let presenceDuration = 0;
  let absenseDuration = 0;
  let delayDuration = 0;
  let scheduledPresense = 0;

  let employee = await Employee.findOne({
    where: {
      id: employeeId,
    },
  });
  if (!employee) return "employeeNotFound";
  let workDays = employee.workdays;

  const dateMove = new Date(startDate);
  let strDate = startDate;

  while (strDate < endDate) {
    strDate = dateMove.toISOString().slice(0, 10);
    listDate.push(strDate);
    dateMove.setDate(dateMove.getDate() + 1);
  }
  for (i = 0; i < listDate.length; i++) {
    var date = listDate[i]; //current full Date
    var weekDayName = moment(date).format("dddd"); //current day of week
    const beginningOfDay = moment(date, "YYYY-MM-DD").startOf("day");
    const endOfDay = moment(date, "YYYY-MM-DD").endOf("day");
    if (workDays.includes(weekDayName)) {
      let history = await AttendanceRecords.findAll({
        where: {
          employeeId: employeeId,
          createdAt: {
            [Op.gte]: beginningOfDay,
            [Op.lte]: endOfDay,
          },
        },
        order: [["createdAt", "ASC"]],
      });

      if (history.length < 1) continue;
      let workTime;
      if (moment(currentDate).format("YYYY-MM-DD") === listDate[i]) {
        if (currentTime > history[0].endTime)
          workTime = moment(history[0].endTime, "HH:mm:ss").diff(
            moment(history[0].startTime, "HH:mm:ss")
          );
        else {
          workTime = moment(currentTime, "HH:mm:ss").diff(
            moment(history[0].startTime, "HH:mm:ss")
          );
        }
      } else
        workTime = moment(history[0].endTime, "HH:mm:ss").diff(
          moment(history[0].startTime, "HH:mm:ss")
        );
      delayDuration += moment
        .duration(history[0].checkInTime)
        .subtract(moment.duration(history[0].startTime));

      history.forEach((element) => {
        if (element.checkInTime < element.endTime) {
          //scheduled presense calculation
          if (!element.checkOutTime) {
            scheduledPresense += moment
              .duration(date.format("HH:mm:ss"))
              .subtract(moment.duration(element.checkInTime));
          } else if (element.checkOutTime > element.endTime) {
            scheduledPresense += moment
              .duration(element.endTime)
              .subtract(moment.duration(element.checkInTime));
          } else {
            scheduledPresense += moment
              .duration(element.checkOutTime)
              .subtract(moment.duration(element.checkInTime));
          }
        }
        if (!element.checkOutTime) {
          presenceDuration += moment
            .duration(date.format("HH:mm:ss"))
            .subtract(moment.duration(element.checkInTime));
        } else {
          presenceDuration += moment
            .duration(element.checkOutTime)
            .subtract(moment.duration(element.checkInTime));
        }
        absenseDuration += moment(workTime).diff(moment(scheduledPresense));
      });
    }
  }
  record.presence = moment.utc(presenceDuration).format("HH:mm:ss");
  record.absence = moment.utc(absenseDuration).format("HH:mm:ss");
  record.delay = moment.utc(delayDuration).format("HH:mm:ss");

  return record;
};
