const express = require("express");
const router = express.Router();
const QRCodeController = require("../../controller/QRCode/QRCode");

router.post(
  "/employer/workplace/:id/updateQRCode",
  QRCodeController.QRCodeGenerator
);

module.exports = router;
