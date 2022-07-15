const QRCode = require("qrcode");

function QRcodeGenerator(data, fileName) {
  QRCode.toFile(
    `QRcode_files/${fileName}.png`,
    data,
    {
      // color: {
      //   dark: "#00F", // Blue dots
      //   light: "#0000", // Transparent background
      // },
      scale: 5,
    },
    function (err) {
      if (err) throw err;
      return `QRcode_files/${fileName}.png`;
    }
  );
}

module.exports.QRcodeGenerator = QRcodeGenerator;
