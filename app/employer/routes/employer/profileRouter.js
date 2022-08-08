const express = require("express");
const router = express.Router();
const profileController = require("../../controller/employer/profile");

const {
  verifyToken,
} = require("../../../../middleware/verification/employerLoginVerify");

router.get("/employer/profile", verifyToken, profileController.profile);
router.put("/employer/editProfile", verifyToken, profileController.editProfile);

module.exports = router;
