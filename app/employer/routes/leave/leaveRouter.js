const express = require("express");
const router = express.Router();
const leaveRequestController = require("../../controller/leave/leaveController");
const {
  verifyToken,
} = require("../../../../middleware/verification/employerLoginVerify");

router.get(
  "/employer/workplace/:id/leaveRequests",
  verifyToken,
  leaveRequestController.indexLeaves
);
router.patch(
  "/employer/leave/:id/approve",
  verifyToken,
  leaveRequestController.approveLeaveRequest
);
router.patch(
  "/employer/leave/:id/decline",
  verifyToken,
  leaveRequestController.declineLeaveRequest
);

module.exports = router;
