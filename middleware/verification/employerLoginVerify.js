const jwt = require("jsonwebtoken");
const dict = require("../../resources/dict");
const Employer = require("../../models/Employer");
const Response = require("../../services/responses/general");

const verifyToken = async (req, res, next) => {
  let response = new Response();
  if (!req.headers.authorization) {
    response.setStatus(400).setMessage("fail").setRes(dict.enterToken);
    return res.status(400).send(response.handler());
  }
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.JWT_KEY, async (err, employer) => {
    if (err) {
      response.setStatus(400).setMessage("fail").setRes(dict.invalidToken);
      return res.status(400).send(response.handler());
    }
    const foundEmployer = await Employer.findOne({
      where: {
        id: employer.id,
        roleId: employer.roleId,
      },
    });
    if (foundEmployer)
      if (foundEmployer.activityStatus === false) {
        response
          .setStatus(400)
          .setMessage("fail")
          .setRes("yourAcoountIsNotActive");
        return res.status(400).send(response.handler());
      }
    if (!foundEmployer) {
      response.setStatus(400).setMessage("fail").setRes(dict.invalidToken);
      return res.status(400).send(response.handler());
    }

    req.Employer = foundEmployer;

    next();
  });
};

module.exports = {
  verifyToken,
};
