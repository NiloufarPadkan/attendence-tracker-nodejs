const leaveService = require("../../service/leave/leave");
const Response = require("../../../../services/response");

exports.leaveRequest = async (req, res, next) => {
  try {
    const leaveRequestResponse = await leaveService.leaveRequest(req);
    let response = new Response(200, "success", leaveRequestResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
