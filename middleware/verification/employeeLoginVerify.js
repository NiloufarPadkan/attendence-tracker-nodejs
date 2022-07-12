const jwt = require("jsonwebtoken");
const dict = require("../../resources/dict");
const Employee = require("../../models//Employee");
const Response = require("../../services/responses/general");

const verifyToken = async (req, res, next) => {
  let response = new Response();
  if (!req.headers.authorization) {
    response.setStatus(400).setMessage("fail").setRes(dict.enterToken);
    return res.status(400).send(response.handler());
  }
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.JWT_KEY, async (err, employee) => {
    if (err) {
      response.setStatus(400).setMessage("fail").setRes(dict.invalidToken);
      return res.status(400).send(response.handler());
    }
    const foundEmployee = await Employee.findOne({
      where: {
        id: employee.id,
        roleId: employee.roleId,
      },
    });
    if (foundEmployee)
      if (foundEmployee.activityStatus === false) {
        response
          .setStatus(400)
          .setMessage("fail")
          .setRes("yourAcoountIsNotActive");
        return res.status(400).send(response.handler());
      }
    if (!foundEmployee) {
      response.setStatus(400).setMessage("fail").setRes(dict.invalidToken);
      return res.status(400).send(response.handler());
    }

    req.Employee = foundEmployee;

    next();
  });
};

module.exports = {
  verifyToken,
};
