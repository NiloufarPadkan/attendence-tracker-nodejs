const Employer = require("../../../../models/Employer");
const persianize = require("persianize");
const validator = require("validator");

exports.showProfile = async (req) => {
  try {
    let me = await Employer.findOne({
      where: {
        id: req.Employer.id,
      },

      attributes: { exclude: ["createdAt", "updatedAt", "otp"] },
    });
    return me;
  } catch (error) {
    throw new Error(error);
  }
};
exports.editProfile = async (req) => {
  try {
    let employer = await Employer.findOne({
      where: {
        id: req.Employer.id,
      },
    });

    if (req.body.fname) employer.fname = req.body.fname;

    if (req.body.lname) employer.lname = req.body.lname;

    if (req.body.phone) {
      if (persianize.validator().mobile(req.body.input)) return "invalidPhone";

      let duplicatePhone = await Employer.findOne({
        where: {
          phone: req.body.phone,
        },
      });
      if (duplicatePhone && duplicatePhone.id !== req.Employee.id)
        return "duplicatePhone";
    }
    employer.phone = req.body.phone;

    if (req.body.email) {
      if (!validator.isEmail(req.body.email)) return "invalidEmail";
      let duplicateEmail = await Employer.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (duplicateEmail && duplicateEmail.id !== req.Employer.id)
        return "duplicateEmail";
      employer.email = req.body.email;
    }

    await employer.save();
    return employer;
  } catch (error) {
    throw new Error(error);
  }
};
