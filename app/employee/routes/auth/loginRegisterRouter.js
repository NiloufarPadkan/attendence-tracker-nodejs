const express = require("express");
const router = express.Router();
const loginRegisterController = require("../../controller/auth/loginRegister");
const {
  customerValidation,
} = require("../../../../middleware/validations/employeeRegisterValidation");
// const {
//     verifyToken
// } = require('../../../../middleware/verification/customerLoginVerify');

router.post(
  "/employee/login-register",
  customerValidation,
  loginRegisterController.login_register
);
router.post(
  "/employee/sendOTP",
  customerValidation,
  loginRegisterController.sendOTP
);

module.exports = router;
