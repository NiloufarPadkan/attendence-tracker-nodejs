let attandanceHistoryService = require("../../../../services/attendanceHistory");

exports.dailyHistory = async (req) => {
  let history = attandanceHistoryService.dailyHistory(req.Employee.id);
  return history;
};
exports.getHistoryByDate = async (req) => {
  let employeeId = req.Employee.id;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  let history = attandanceHistoryService.getHistoryByDate(
    employeeId,
    startDate,
    endDate
  );
  return history;
};
