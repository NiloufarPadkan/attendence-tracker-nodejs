const express = require("express");
const router = express.Router();
const checkOutController = require("../../controller/workplace/check-out");
const {
  verifyToken,
} = require("../../../../middleware/verification/employeeLoginVerify");

router.post("/employee/checkOut", verifyToken, checkOutController.checkOut);

module.exports = router;
