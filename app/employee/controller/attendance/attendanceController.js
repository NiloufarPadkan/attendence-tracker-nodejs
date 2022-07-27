const attendanceService = require("../../service/attendance/attendanceHistory");
const Response = require("../../../../services/response");

exports.getDailyHistory = async (req, res, next) => {
  try {
    const showProfileResponse = await attendanceService.dailyHistory(req);
    let response = new Response(200, "success", showProfileResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
exports.getHistoryByDate = async (req, res, next) => {
  try {
    const showProfileResponse = await attendanceService.getHistoryByDate(req);
    let response = new Response(200, "success", showProfileResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
