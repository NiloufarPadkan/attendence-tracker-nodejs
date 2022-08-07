const express = require("express");
const router = express.Router();
const workplaceController = require("../../controller/workplace/workplaceController");

const {
  verifyToken,
} = require("../../../../middleware/verification/employerLoginVerify");

router.post(
  "/employer/workplace/add",
  verifyToken,
  workplaceController.addWorkPlace
);
router.get(
  "/employer/workplaces",
  verifyToken,
  workplaceController.indexWorkplaces
);
router.post(
  "/employer/workplace/:id/addWorkSchedule",
  verifyToken,
  workplaceController.addWorkSchedule
);
router.get(
  "/employer/workplace/:id/schedules",
  verifyToken,
  workplaceController.indexWorkSchedules
);
router.post(
  "/employer/workplace/:id/addEmployee",
  verifyToken,
  workplaceController.addemployeeToWorkSchedule
);
router.get(
  "/employer/workplace/:id/recentAttendance",
  verifyToken,
  workplaceController.recentAttendance
);
router.post(
  "/employer/workplace/:id/AttendanceByDate",
  verifyToken,
  workplaceController.recentAttendanceByDate
);

module.exports = router;
