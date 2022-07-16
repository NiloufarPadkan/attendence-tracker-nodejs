const checkInService = require("../../service/workplace/check-in");
const Response = require("../../../../services/response");

exports.checkIn = async (req, res, next) => {
  try {
    const checkInResponse = await checkInService.checkIn(req);
    if (
      checkInResponse === "invalidQRcode" ||
      checkInResponse === "AlreadyCheckedIn"
    ) {
      let response = new Response(400, "fail", checkInResponse);
      return res.status(400).send(response.handler());
    }
    let response = new Response(200, "success", checkInResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
exports.checkInStatus = async (req, res, next) => {
  try {
    const checkInStatusResponse = await checkInService.checkInStatus(req);
    let response = new Response(200, "success", checkInStatusResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
