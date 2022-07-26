const express = require("express");
const router = express.Router();
const attendanceHistoryController = require("../../controller/attendance/attendanceController");
const {
  verifyToken,
} = require("../../../../middleware/verification/employeeLoginVerify");

router.get(
  "/employee/dailyAttendance",
  verifyToken,
  attendanceHistoryController.getDailyHistory
);

module.exports = router;
