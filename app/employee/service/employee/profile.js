const Employee = require("../../../../models/Employee");
const persianize = require("persianize");
const validator = require("validator");

exports.showProfile = async (req) => {
  try {
    let me = await Employee.findOne({
      where: {
        id: req.Employee.id,
      },
    });
    return me;
  } catch (error) {
    throw new Error(error);
  }
};
exports.editProfile = async (req) => {
  try {
    let employee = await Employee.findOne({
      where: {
        id: req.Employee.id,
      },
    });

    if (req.body.fname) employee.fname = req.body.fname;

    if (req.body.lname) employee.lname = req.body.lname;

    if (req.body.phone) {
      if (persianize.validator().mobile(req.body.input)) return "invalidPhone";

      let duplicatePhone = await Employee.findOne({
        where: {
          phone: req.body.phone,
        },
      });
      if (duplicatePhone && duplicatePhone.id !== req.Employee.id)
        return "duplicatePhone";
    }
    employee.phone = req.body.phone;

    if (req.body.email) {
      if (!validator.isEmail(req.body.email)) return "invalidEmail";
      let duplicateEmail = await Employee.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (duplicateEmail && duplicateEmail.id !== req.Employee.id)
        return "duplicateEmail";
      employee.email = req.body.email;
    }

    await employee.save();
    return employee;
  } catch (error) {
    throw new Error(error);
  }
};
