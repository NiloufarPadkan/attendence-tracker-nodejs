const Workplace = require("../../../../models/Workplace");
const QRcodeGenerator =
  require("../../../../utils/QRcodeGenerator").QRcodeGenerator;

const { encrypt } = require("../../../../utils/cryproUtil");

var randomstring = require("randomstring");

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
    const hash = encrypt(text);
    // let QRCodePath = QRcodeGenerator(text, workplaceId);
    workplace.hash = { content: hash.content, iv: hash.iv };
    await workplace.save();
    return text;
  } catch (error) {
    throw new Error(error);
  }
};
