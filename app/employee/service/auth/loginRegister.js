const Employee = require("../../../../models/Employee");
const tokenGenerator = require("../../../../utils/jwtUtil").genToken;
const validator = require("validator");
const persianize = require("persianize");

function isActiveEmployee(employee) {
  console.log(employee.activityStatus);
  if (Employee.activityStatus === false) {
    return false;
  } else {
    return true;
  }
}

exports.sendOtp = async (req) => {
  let otp = 2564;
  try {
    let input = req.body.input;
    let employee;
    if (validator.isEmail(input)) {
      employee = await Employee.findOne({
        where: {
          email: req.body.input,
          roleId: 3,
        },
      });
      if (!employee) {
        employee = new Employee({
          email: req.body.input,
          roleId: 3,
        });
      }
    } else if (persianize.validator().mobile(input)) {
      //send random code
      employee = await Employee.findOne({
        where: {
          phone: req.body.input,
          roleId: 3,
        },
      });
      if (!employee) {
        employee = new Employee({
          phone: req.body.input,
          roleId: 3,
        });
      }
    }

    if (!isActiveEmployee(employee)) {
      return "yourAcoountIsNotActive";
    }

    employee.otp = otp;
    await employee.save();
    return "otpSent";
  } catch (e) {
    throw new Error(e);
  }
};

exports.login_signup = async (req) => {
  let code = 2564;
  try {
    let input = req.body.input;
    let employee;
    if (validator.isEmail(input)) {
      employee = await Employee.findOne({
        where: {
          email: req.body.input,
          roleId: 3,
        },
        raw: true,
      });
    } else if (persianize.validator().mobile(input)) {
      employee = await Employee.findOne({
        where: {
          phone: req.body.input,
          roleId: 3,
        },
        raw: true,
      });
    }

    if (!isActiveEmployee(employee)) {
      return "yourAcoountIsNotActive";
    }
    if (!employee.otp == req.body.code) {
      return "invalidCode";
    }

    const accessToken = tokenGenerator(employee.id, employee.roleId);

    req.Employee = Employee;

    return accessToken;
  } catch (e) {
    throw new Error(e);
  }
};
