const workplaceService = require("../../service/workplace/workplaceService");
const Response = require("../../../../services/response");

exports.addWorkPlace = async (req, res, next) => {
  try {
    const addWorkplaceresponse = await workplaceService.addWorkPlace(req);
    let response = new Response(200, "success", addWorkplaceresponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
exports.indexWorkplaces = async (req, res, next) => {
  try {
    const indexEmployeesResponse = await workplaceService.indexWorkPlaces(req);
    let response = new Response(200, "success", indexEmployeesResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
exports.addWorkSchedule = async (req, res, next) => {
  try {
    const addWorkScheduleResponse = await workplaceService.addWorkSchedule(req);
    let response = new Response(200, "success", addWorkScheduleResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
exports.indexWorkSchedules = async (req, res, next) => {
  try {
    const indexWorkScheduleResponse = await workplaceService.indexWorkSchedules(
      req
    );
    let response = new Response(200, "success", indexWorkScheduleResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
exports.addemployeeToWorkSchedule = async (req, res, next) => {
  try {
    const addemployeeToWorkScheduleResponse =
      await workplaceService.addEmployeeToWorkplace(req);
    let response = new Response(
      200,
      "success",
      addemployeeToWorkScheduleResponse
    );
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
exports.recentAttendance = async (req, res, next) => {
  try {
    const recentAttendanceResponse =
      await workplaceService.workplaceRecentAttendance(req);
    let response = new Response(200, "success", recentAttendanceResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
exports.recentAttendanceByDate = async (req, res, next) => {
  try {
    const recentAttendanceResponse =
      await workplaceService.workplaceAttendanceByDate(req);
    let response = new Response(200, "success", recentAttendanceResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
