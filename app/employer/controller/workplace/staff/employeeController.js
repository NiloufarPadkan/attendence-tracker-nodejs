const employeeService = require("../../../service/workplace/staff/employee");
const Response = require("../../../../../services/response");

exports.showPresentEmployees = async (req, res, next) => {
  try {
    const showEmployeesResponse = await employeeService.showPresentEmployees(
      req
    );
    let response = new Response(200, "success", showEmployeesResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
exports.indexEmployees = async (req, res, next) => {
  try {
    const indexEmployeesResponse = await employeeService.indexEmployees(req);
    let response = new Response(200, "success", indexEmployeesResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
