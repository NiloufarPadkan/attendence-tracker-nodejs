const express = require("express");
const router = express.Router();
const leaveRequestController = require("../../controller/leave/leaveController");

router.get(
  "/employer/workplace/:id/leaveRequests",
  leaveRequestController.indexLeaves
);
router.patch(
  "/employer/leave/:id/approve",
  leaveRequestController.approveLeaveRequest
);
router.patch(
  "/employer/leave/:id/decline",
  leaveRequestController.declineLeaveRequest
);

module.exports = router;
