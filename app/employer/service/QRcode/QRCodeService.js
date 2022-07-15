const Workplace = require("../../../../models/Workplace");
const QRcodeGenerator =
  require("../../../../utils/QRcodeGenerator").QRcodeGenerator;

var randomstring = require("randomstring");
// TO DO :hash the qr code data

exports.generateNewQRCode = async (req) => {
  try {
    let workplaceId = req.params.id;
    let workplace = await Workplace.findOne({
      where: {
        id: workplaceId,
        // employerId: req.employer.id,
      },
    });
    if (!workplace) {
      return "workplaceNotFound";
    }
    let text = randomstring.generate({
      length: 50,
    });
    let QRCodePath = QRcodeGenerator(text, workplaceId);
    // use the return value here instead of like a regular (non-evented) return value
    workplace.QRcode = QRCodePath;
    workplace.hash = text;
    await workplace.save();
    return workplace;
  } catch (error) {
    throw new Error(error);
  }
};
