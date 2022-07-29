const Sequelize = require("sequelize");

const sequelize = new Sequelize("attendance_tracker", "root", "", {
  dialect: "mysql",
  port: process.env.SQL_PORT,
  host: "localhost",
  charset: "utf8",
  collate: "utf8_persian_ci",
  logging: false,
  // dialectOptions: {
  //   useUTC: false, // -->Add this line. for reading from database
  // },
  timezone: "+04:30",
});

module.exports = sequelize;
