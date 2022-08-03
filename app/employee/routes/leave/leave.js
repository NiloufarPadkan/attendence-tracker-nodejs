const express = require("express");
const router = express.Router();
const leaveRequestController = require("../../controller/leave/leaveController");
const {
  verifyToken,
} = require("../../../../middleware/verification/employeeLoginVerify");

router.post(
  "/employee/leaveRequest",
  verifyToken,
  leaveRequestController.leaveRequest
);
router.get("/employee/leaves", verifyToken, leaveRequestController.indexLeaves);

module.exports = router;
