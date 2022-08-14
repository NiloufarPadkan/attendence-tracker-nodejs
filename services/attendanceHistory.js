const Sequelize = require("sequelize");
const moment = require("moment");
const Employee = require("../models/Employee");
const AttendanceRecords = require("../models/AttendanceRecords");
const Leave = require("../models/Leave");
const WorkSchedule = require("../models/WorkSchedule");
const Op = Sequelize.Op;
var jalali_moment = require("jalali-moment");
var moment_jalali_holiday = require("moment-jalaali-holiday");

function dhm(dur) {
  var dur = moment.duration(dur);
  var hours = Math.floor(dur.asHours());
  var mins = Math.floor(dur.asMinutes()) - hours * 60;
  var sec = Math.floor(dur.asSeconds()) - hours * 60 * 60 - mins * 60;

  var result =
    (hours > 9 ? hours : "0" + hours) +
    ":" +
    (mins > 9 ? mins : "0" + mins) +
    ":" +
    (sec > 9 ? sec : "0" + sec);

  return result;
}

function calculatePresense(history, currentDate) {
  let presenceDuration = 0;
  let scheduledPresenseduration = 0;

  history.forEach((element) => {
    if (element.checkInTime < element.endTime) {
      if (element.checkOutTime > element.endTime) {
        scheduledPresenseduration += moment
          .duration(element.endTime)
          .subtract(moment.duration(element.checkInTime));
      } else if (element.checkInTime > element.startTime) {
        scheduledPresenseduration += moment
          .duration(element.checkOutTime)
          .subtract(moment.duration(element.checkInTime));
      }
    }
    presenceDuration += moment
      .duration(element.checkOutTime)
      .subtract(moment.duration(element.checkInTime));
  });
  return { presenceDuration, scheduledPresenseduration };
}
exports.dailyHistory = async (employeeId) => {
  var currentDate = moment(currentDate).format("YYYY-MM-DD"); //current date
  let record = await this.getHistoryByDate(
    employeeId,
    currentDate,
    currentDate
  );
  return record;
};
exports.getHistoryByDate = async (employeeId, startDate, endDate) => {
  const listDate = [];
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

  if (startDate == endDate) {
    listDate.push(startDate);
  } else {
    const dateMove = new Date(startDate);
    let strDate = startDate;
    while (strDate < endDate) {
      strDate = dateMove.toISOString().slice(0, 10);
      listDate.push(strDate);
      dateMove.setDate(dateMove.getDate() + 1);
    }
  }
  for (i = 0; i < listDate.length; i++) {
    //
    var date = listDate[i]; //current full Date
    var weekDayName = moment(date).format("dddd"); //current day of week
    const beginningOfDay = moment(date, "YYYY-MM-DD").startOf("day");
    const endOfDay = moment(date, "YYYY-MM-DD").endOf("day");
    let jalaliDate = jalali_moment(date).locale("fa").format("YYYY/M/D");

    let isHoliday = moment_jalali_holiday(
      jalaliDate,
      "jYYYY/jMM/jDD"
    ).isHoliday();

    //records of ths date

    let history = await AttendanceRecords.findAll({
      where: {
        employeeId: employeeId,
        createdAt: {
          [Op.gte]: beginningOfDay,
          [Op.lte]: endOfDay,
        },
        checkOutTime: { [Op.ne]: null },
      },
      order: [["createdAt", "ASC"]],
    });

    // find leave
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
    if (confirmedLeave) {
      let startLeaveTime = moment(
        new Date(confirmedLeave.startDateTime)
      ).format("HH:mm:ss");

      let endLeaveTime = moment(new Date(confirmedLeave.endDateTime)).format(
        "HH:mm:ss"
      );

      if (confirmedLeave.type == "daily") {
        // leaveDuration += moment
        //   .duration(endLeaveTime)
        //   .subtract(moment.duration(startLeaveTime));
        continue;
      } else if (confirmedLeave && confirmedLeave.type == "hourly") {
        if (
          currentTime > startLeaveTime &&
          currentTime < endLeaveTime &&
          moment(currentDate).format("YYYY-MM-DD") === listDate[i]
        ) {
          //mohasebe inke ta alan cheghad bayad morkhassi mimoond
          leaveDuration += moment
            .duration(currentDate.format("HH:mm:ss"))
            .subtract(moment.duration(startLeaveTime));
        } else {
          leaveDuration += moment
            .duration(endLeaveTime)
            .subtract(moment.duration(startLeaveTime));
        }
      }
    }

    //if no records found
    if (history.length < 1 && !isHoliday && workDays.includes(weekDayName)) {
      if (confirmedLeave) {
        if (
          currentTime < employee.workSchedule.endTime &&
          moment(currentDate).format("YYYY-MM-DD") === listDate[i]
        ) {
          absenseDuration += moment(currentDate, "HH:mm:ss").diff(
            moment(employee.workSchedule.startTime, "HH:mm:ss")
          );
        } else {
          absenseDuration += moment(
            employee.workSchedule.endTime,
            "HH:mm:ss"
          ).diff(moment(employee.workSchedule.startTime, "HH:mm:ss"));
        }

        absenseDuration -= moment.duration(leaveDuration);
        continue;
      } else {
        if (
          currentTime < employee.workSchedule.endTime &&
          moment(currentDate).format("YYYY-MM-DD") === listDate[i]
        ) {
          absenseDuration += moment(currentDate, "HH:mm:ss").diff(
            moment(employee.workSchedule.startTime, "HH:mm:ss")
          );
        } else {
          absenseDuration += moment(
            employee.workSchedule.endTime,
            "HH:mm:ss"
          ).diff(moment(employee.workSchedule.startTime, "HH:mm:ss"));
        }

        continue;
      }
    } else {
      // calculate over time
      if (!workDays.includes(weekDayName) || isHoliday) {
        history.forEach((element) => {
          if (!element.checkOutTime) {
            overTimeDuration += moment
              .duration(currentDate.format("HH:mm:ss"))
              .subtract(moment.duration(element.checkInTime));
          } else {
            overTimeDuration += moment
              .duration(element.checkOutTime)
              .subtract(moment.duration(element.checkInTime));
          }
        });
        continue;
      }
      let workTime = 0;

      if (moment(currentDate).format("YYYY-MM-DD") === listDate[i]) {
        if (currentTime > history[0].endTime)
          workTime = moment(history[0].endTime, "HH:mm:ss").diff(
            moment(history[0].startTime, "HH:mm:ss")
          );
        else if (
          currentTime > history[0].startTime &&
          currentTime < history[0].endTime
        ) {
          workTime = moment(currentTime, "HH:mm:ss").diff(
            moment(history[0].startTime, "HH:mm:ss")
          );
        }
      } else
        workTime = moment(history[0].endTime, "HH:mm:ss").diff(
          moment(history[0].startTime, "HH:mm:ss")
        );
      workTime = moment(workTime).diff(moment(leaveDuration));

      // if (workTime == 0) {
      //   continue;
      // }

      let presenseCalculation = calculatePresense(history, currentDate);
      presenceDuration += presenseCalculation.presenceDuration;
      scheduledPresenseduration +=
        presenseCalculation.scheduledPresenseduration;
      absenseDuration += moment(workTime).diff(
        moment(presenseCalculation.scheduledPresenseduration)
      );
      let firstCheckIn = history.find((el) => el.checkInTime >= el.startTime);
      if (
        confirmedLeave &&
        confirmedLeave.type == "hourly" &&
        firstCheckIn.checkInTime >
          moment(new Date(confirmedLeave.endDateTime)).format("HH:mm:ss")
      ) {
        delayDuration += moment
          .duration(firstCheckIn.checkInTime)
          .subtract(
            moment(new Date(confirmedLeave.endDateTime)).format("HH:mm:ss")
          );
      } else if (firstCheckIn.checkInTime >= firstCheckIn.startTime) {
        delayDuration += moment
          .duration(firstCheckIn.checkInTime)
          .subtract(moment.duration(firstCheckIn.startTime));
      }
    }
  }
  overTimeDuration += moment(presenceDuration).diff(
    moment(scheduledPresenseduration)
  );
  record.presence = dhm(presenceDuration);
  record.absence = dhm(absenseDuration);
  record.delay = dhm(delayDuration);
  record.overTime = dhm(overTimeDuration);

  return record;
};
