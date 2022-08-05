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

module.exports = router;
