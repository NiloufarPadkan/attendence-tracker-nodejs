const express = require("express");
const router = express.Router();
const staffController = require("../../../controller/workplace/staff/employeeController");
const {
  verifyToken,
} = require("../../../../../middleware/verification/employerLoginVerify");

router.get(
  "/employer/workplace/:id/indexEmployees",
  verifyToken,
  staffController.indexEmployees
);
router.get(
  "/employer/workplace/:id/presentEmloyees",
  verifyToken,
  staffController.showPresentEmployees
);
router.get(
  "/employer/employee/:id/dailyHistory",
  verifyToken,
  staffController.dailyHistory
);
router.get(
  "/employer/employee/:id/getAttendanceBydate",
  verifyToken,
  staffController.historyByDate
);
router.get(
  "/employer/employee/:id/recentAttendance",
  verifyToken,
  staffController.recentAttendance
);
router.get(
  "/employer/employee/:id/AttendanceByDate",
  verifyToken,
  staffController.recentAttendanceByDate
);

module.exports = router;
