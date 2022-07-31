const profileService = require("../../service/employee/profile");
const Response = require("../../../../services/response");

exports.profile = async (req, res, next) => {
  try {
    const showProfileResponse = await profileService.showProfile(req);
    let response = new Response(200, "success", showProfileResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
exports.editProfile = async (req, res, next) => {
  try {
    const editProfileResponse = await profileService.editProfile(req);
    if (
      editProfileResponse === "invalidEmail" ||
      editProfileResponse === "invalidPhone" ||
      editProfileResponse === "duplicateEmail" ||
      editProfileResponse === "duplicatePhone"
    ) {
      let response = new Response(400, "fail", editProfileResponse);
      return res.status(400).send(response.handler());
    }
    let response = new Response(200, "success", editProfileResponse);
    return res.status(200).send(response.handler());
  } catch (e) {
    if (e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};
