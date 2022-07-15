const QRCodeService = require("../../service/QRcode/QRCodeService");
const Response = require("../../../../services/response");

exports.QRCodeGenerator = async (req, res, next) => {
  try {
    const generateQRCodeResponse = await QRCodeService.generateNewQRCode(req);
    if (generateQRCodeResponse === "workplaceNotFound") {
      let response = new Response(404, "fail", generateQRCodeResponse);
      return res.status(404).send(response.handler());
    }
    let response = new Response(200, "success", generateQRCodeResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
