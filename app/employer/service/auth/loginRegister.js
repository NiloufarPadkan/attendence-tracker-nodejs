const Employer = require("../../../../models/Employer");
const tokenGenerator = require("../../../../utils/jwtUtil").genToken;
const validator = require("validator");
const persianize = require("persianize");

exports.sendOtp = async (req) => {
  let otp = 2564;
  try {
    let input = req.body.input;
    let employer;
    if (validator.isEmail(input)) {
      employer = await Employer.findOne({
        where: {
          email: req.body.input,
          roleId: 2,
        },
      });
      if (!employer) {
        employer = new Employer({
          email: req.body.input,
          roleId: 2,
        });
      }
    } else if (persianize.validator().mobile(input)) {
      //send random code
      employer = await Employer.findOne({
        where: {
          phone: req.body.input,
          roleId: 2,
        },
      });
      if (!employer) {
        employer = new Employer({
          phone: req.body.input,
          roleId: 3,
        });
      }
    }

    employer.otp = otp;
    await employer.save();
    return "otpSent";
  } catch (e) {
    throw new Error(e);
  }
};

exports.login_signup = async (req) => {
  let code = 2564;
  try {
    let input = req.body.input;
    let employer;
    if (validator.isEmail(input)) {
      employer = await Employer.findOne({
        where: {
          email: req.body.input,
          roleId: 2,
        },
        raw: true,
      });
    } else if (persianize.validator().mobile(input)) {
      employer = await Employer.findOne({
        where: {
          phone: req.body.input,
          roleId: 2,
        },
        raw: true,
      });
    }

    if (!employer.otp == req.body.code) {
      return "invalidCode";
    }

    const accessToken = tokenGenerator(employer.id, employer.roleId);

    req.Employer = employer;

    return accessToken;
  } catch (e) {
    throw new Error(e);
  }
};
