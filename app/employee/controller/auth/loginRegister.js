const loginService = require('../../service/auth/loginRegister');
const Response = require('../../../../services/response');

exports.login_register = async (req, res, next) => {
    try {
        const loginResponse = await loginService.login_signup(req);
        if (loginResponse === 'yourAcoountIsNotActive') {
            let response = new Response(400, 'fail', loginResponse);
            return res.status(400).send(response.handler());
        }
        let response = new Response(200, 'success', loginResponse);
        return res.status(200).send(response.handler());
    } catch (e) {
        if (e.statusCode) {
            err.statusCode = 500;
        }
        next(e);
    }
};
exports.sendOTP = async (req, res, next) => {
    try {
        const loginResponse = await loginService.sendOtp(req);
        if (loginResponse === 'invalidCode') {
            let response = new Response(400, 'fail', loginResponse);
            return res.status(400).send(response.handler());
        }
        let response = new Response(200, 'success', loginResponse);
        return res.status(200).send(response.handler());
    } catch (e) {
        if (e.statusCode) {
            err.statusCode = 500;
        }
        next(e);
    }
};
