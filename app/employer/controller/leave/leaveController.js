const leaveService = require("../../service/leave/leaveService");
const Response = require("../../../../services/response");

exports.indexLeaves = async (req, res, next) => {
  try {
    const indexLeavesResponse = await leaveService.indexLeaves(req);

    let response = new Response(200, "success", indexLeavesResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
exports.approveLeaveRequest = async (req, res, next) => {
  try {
    const approveLeaveRequestResponse = await leaveService.approveLeaveRequest(
      req
    );

    let response = new Response(200, "success", approveLeaveRequestResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
exports.declineLeaveRequest = async (req, res, next) => {
  try {
    const declineLeaveRequestResponse = await leaveService.declineLeaveRequest(
      req
    );

    let response = new Response(200, "success", declineLeaveRequestResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
