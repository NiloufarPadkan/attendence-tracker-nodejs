const express = require('express');
const router = express.Router();
const loginRegisterController = require('../../controller/auth/loginRegister');
const {
    customerValidation
} = require('../../../../middleware/validations/customerValidation');
// const {
//     verifyToken
// } = require('../../../../middleware/verification/customerLoginVerify');

router.post(
    '/employee/login-register',
    customerValidation,
    loginRegisterController.login_register
);
router.post(
    '/employee/sendOTP',
    customerValidation,
    loginRegisterController.sendOTP
);
// router.get('/customer/me', verifyToken, meController.me);

module.exports = router;
