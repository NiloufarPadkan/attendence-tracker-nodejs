const express = require("express");
const router = express.Router();
const QRCodeController = require("../../controller/QRCode/QRCode");

// const {
//   verifyToken,
// } = require("../../../../middleware/verification/employeeLoginVerify");

router.post(
  "/employer/workplace/:id/updateQRCode",
  QRCodeController.QRCodeGenerator
);

module.exports = router;
