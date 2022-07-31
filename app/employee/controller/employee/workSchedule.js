const workScheduleService = require("../../service/employee/workSchedule");
const Response = require("../../../../services/response");

exports.mySchedule = async (req, res, next) => {
  try {
    const showProfileResponse = await workScheduleService.showWorkSchedule(req);
    let response = new Response(200, "success", showProfileResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
