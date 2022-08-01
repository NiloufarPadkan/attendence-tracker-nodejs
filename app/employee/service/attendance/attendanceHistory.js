const Sequelize = require("sequelize");
const moment = require("moment");
const Employee = require("../../../../models/Employee");
const AttendanceRecords = require("../../../../models/AttendanceRecords");
const Leave = require("../../../../models/Leave");
const WorkSchedule = require("../../../../models/WorkSchedule");
const Op = Sequelize.Op;

function calculatePresense(
  history,
  presenceDuration,
  scheduledPresenseduration,
  currentDate,
  confirmedLeave
) {
  history.forEach((element) => {
    if (element.checkInTime < element.endTime) {
      if (!element.checkOutTime) {
        scheduledPresenseduration += moment
          .duration(currentDate.format("HH:mm:ss"))
          .subtract(moment.duration(element.checkInTime));
      } else if (element.checkOutTime > element.endTime) {
        scheduledPresenseduration += moment
          .duration(element.endTime)
          .subtract(moment.duration(element.checkInTime));
      } else {
        scheduledPresenseduration += moment
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
  });
  return { presenceDuration, scheduledPresenseduration };
}
exports.dailyHistory = async (req) => {
  let employeeId = req.Employee.id;
  var currentDate = moment(new Date()); //current full Date
  var currentTime = moment(currentDate).format("HH:mm:ss"); //current full Date
  var currentDayName = moment(currentDate).format("dddd"); //current day of week
  const beginningOfDay = moment(currentDate, "YYYY-MM-DD").startOf("day");
  const endOfDay = moment(currentDate, "YYYY-MM-DD").endOf("day");
  let workTime;

  let record = {
    presence: "00:00:00",
    absence: "00:00:00",
    delay: "00:00:00",
    overTime: "00:00:00",
  };

  let presenceDuration = 0;
  let scheduledPresenseduration = 0;
  let absenseDuration = 0;
  let leaveDuration = 0;

  let employee = await Employee.findOne({
    where: {
      id: employeeId,
    },
    include: [
      {
        model: WorkSchedule,
      },
    ],
  });
  if (!employee) return "employeeNotFound";
  let workDays = employee.workdays;

  if (workDays.includes(currentDayName)) {
    let confirmedLeave = await Leave.findOne({
      where: {
        status: 1,
        employeeId: employeeId,
        startDateTime: {
          [Op.gte]: beginningOfDay.format("YYYY-MM-DD HH:mm:ss").toString(),
          [Op.lte]: endOfDay.format("YYYY-MM-DD HH:mm:ss").toString(),
        },
      },
      raw: true,
    });
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

    if (history.length < 1) {
      if (confirmedLeave && confirmedLeave.type == "daily") {
        return record;
      } else {
        if (currentTime < employee.workSchedule.endTime) {
          absenseDuration += moment
            .duration(currentDate.format("HH:mm:ss"))
            .subtract(moment.duration(employee.workSchedule.startTime));
        } else {
          absenseDuration += moment
            .duration(moment.duration(employee.workSchedule.endTime))
            .subtract(moment.duration(employee.workSchedule.startTime));
        }
        record.absence = moment.utc(absenseDuration).format("HH:mm:ss");
        return record;
      }
    }

    if (confirmedLeave && confirmedLeave.type == "hourly") {
      let startLeaveTime = moment(
        new Date(confirmedLeave.startDateTime)
      ).format("HH:mm:ss");
      let endLeaveTime = moment(new Date(confirmedLeave.endDateTime)).format(
        "HH:mm:ss"
      );
      if (currentTime > startLeaveTime) {
        //mohasebe inke ta alan cheghad bayad morkhassi mimoond
        if (currentTime > endLeaveTime) {
          leaveDuration += moment
            .duration(endLeaveTime)
            .subtract(moment.duration(startLeaveTime));
        } else if (currentTime < endLeaveTime) {
          leaveDuration += moment
            .duration(currentDate.format("HH:mm:ss"))
            .subtract(moment.duration(startLeaveTime));
        }
      }
    }
    if (currentTime > history[0].endTime)
      workTime = moment(history[0].endTime, "HH:mm:ss").diff(
        moment(history[0].startTime, "HH:mm:ss")
      );
    else {
      workTime = moment(currentTime, "HH:mm:ss").diff(
        moment(history[0].startTime, "HH:mm:ss")
      );
    }
    workTime = moment(workTime).diff(moment(leaveDuration));
    if (workTime == 0) {
      return record;
    }

    let delay = moment(history[0].checkInTime, "HH:mm:ss").diff(
      moment(history[0].startTime, "HH:mm:ss")
    );
    if (confirmedLeave && confirmedLeave.type == "hourly") {
      if (
        history[0].checkInTime >
        moment(new Date(confirmedLeave.endDateTime)).format("HH:mm:ss")
      ) {
        delay = moment(history[0].checkInTime, "HH:mm:ss").diff(
          moment(new Date(confirmedLeave.endDateTime), "HH:mm:ss")
        );
      }
    }
    record.delay = moment.utc(delay).format("HH:mm:ss");
    let presenseCalculation = calculatePresense(
      history,
      presenceDuration,
      scheduledPresenseduration,
      currentDate,
      confirmedLeave
    );

    // presense calcuation subtract from leave time
    absenseDuration = moment(workTime).diff(
      moment(presenseCalculation.scheduledPresenseduration)
    );
    overTimeDuration = moment(presenseCalculation.presenceDuration).diff(
      moment(presenseCalculation.scheduledPresenseduration)
    );
    record.presence = moment
      .utc(presenseCalculation.presenceDuration)
      .format("HH:mm:ss");
    record.absence = moment.utc(absenseDuration).format("HH:mm:ss");
    record.overTime = moment.utc(overTimeDuration).format("HH:mm:ss");
  }
  return record;
};
exports.getHistoryByDate = async (req) => {
  const listDate = [];
  let employeeId = req.Employee.id;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  var currentDate = moment(new Date()); //current full Date
  var currentTime = moment(currentDate).format("HH:mm:ss"); //current full Date
  let record = {
    presence: "00:00:00",
    absence: "00:00:00",
    delay: "00:00:00",
    overTime: "00:00:00",
  };
  let presenceDuration = 0;
  let absenseDuration = 0;
  let delayDuration = 0;
  let scheduledPresenseduration = 0;
  let overTimeDuration = 0;

  let employee = await Employee.findOne({
    where: {
      id: employeeId,
    },
    include: [
      {
        model: WorkSchedule,
      },
    ],
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

      let presenseCalculation = calculatePresense(
        history,
        presenceDuration,
        scheduledPresenseduration,
        currentDate
      );
      presenceDuration = presenseCalculation.presenceDuration;
      scheduledPresenseduration = presenseCalculation.scheduledPresenseduration;
      absenseDuration += moment(workTime).diff(
        moment(scheduledPresenseduration)
      );
      overTimeDuration += moment(presenceDuration).diff(
        moment(scheduledPresenseduration)
      );
    }
  }
  record.presence = moment.utc(presenceDuration).format("HH:mm:ss");
  record.absence = moment.utc(absenseDuration).format("HH:mm:ss");
  record.delay = moment.utc(delayDuration).format("HH:mm:ss");
  record.overTime = moment.utc(overTimeDuration).format("HH:mm:ss");

  return record;
};
