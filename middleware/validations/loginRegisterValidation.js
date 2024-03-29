const persianize = require("persianize");
const validator = require("validator");

const Response = require("../../services/responses/general");

const loginRegisterValidation = async (req, res, next) => {
  let response = new Response();
  try {
    if (
      !persianize.validator().mobile(req.body.input) &&
      !validator.isEmail(req.body.input)
    ) {
      response.setStatus(500).setMessage("fail").setRes("invalidPhoneOrEmail");
      return res.status(400).send(response.handler());
    }
    next();
  } catch (e) {
    return res.status(422).send({ error: e });
  }
};

module.exports = {
  loginRegisterValidation,
};
