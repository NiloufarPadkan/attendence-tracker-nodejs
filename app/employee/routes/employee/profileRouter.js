const express = require("express");
const router = express.Router();
const profileController = require("../../controller/employee/profile");

const {
  verifyToken,
} = require("../../../../middleware/verification/employeeLoginVerify");

router.get("/employee/profile", verifyToken, profileController.profile);
router.put("/employee/editProfile", verifyToken, profileController.editProfile);

module.exports = router;
