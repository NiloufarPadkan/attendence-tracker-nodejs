const checkOutService = require("../../service/workplace/check-out");
const Response = require("../../../../services/response");

exports.checkOut = async (req, res, next) => {
  try {
    const checkOutResponse = await checkOutService.checkOut(req);
    if (
      checkOutResponse === "invalidQRcode" ||
      checkOutResponse === "NotcheckedInBefore"
    ) {
      let response = new Response(400, "fail", checkOutResponse);
      return res.status(400).send(response.handler());
    }
    let response = new Response(200, "success", checkOutResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
