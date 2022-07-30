const express = require("express");
const router = express.Router();
const loginRegisterController = require("../../controller/auth/loginRegister");
const {
  loginRegisterValidation,
} = require("../../../../middleware/validations/loginRegisterValidation");
// const {
//     verifyToken
// } = require('../../../../middleware/verification/customerLoginVerify');

router.post(
  "/employer/login-register",
  loginRegisterValidation,
  loginRegisterController.login_register
);
router.post(
  "/employer/sendOTP",
  loginRegisterValidation,
  loginRegisterController.sendOTP
);

module.exports = router;
