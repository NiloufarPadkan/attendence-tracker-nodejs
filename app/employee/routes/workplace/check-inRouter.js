const express = require("express");
const router = express.Router();
const checkInController = require("../../controller/workplace/check-in");
const {
  verifyToken,
} = require("../../../../middleware/verification/employeeLoginVerify");

router.post("/employee/checkIn", verifyToken, checkInController.checkIn);

module.exports = router;
