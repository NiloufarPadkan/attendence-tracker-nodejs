const express = require("express");
const router = express.Router();
const workScheduleController = require("../../controller/employee/workSchedule");

const {
  verifyToken,
} = require("../../../../middleware/verification/employeeLoginVerify");

router.get(
  "/employee/mySchedule",
  verifyToken,
  workScheduleController.mySchedule
);

module.exports = router;
