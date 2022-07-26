const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/database/sequelize");
const employeeAuthRouter = require("./app/employee/routes/auth/loginRegisterRouter");
const employeeProfileRouter = require("./app/employee/routes/profile/profileRouter");
const employeeCheckInRouter = require("./app/employee/routes/workplace/check-inRouter");
const employeeCheckOutRouter = require("./app/employee/routes/workplace/check-outRouter");
const employeeAttendanceHistoryRouter = require("./app/employee/routes/attendance/attendanceRouter");
const EmployerQRCodeRouter = require("./app/employer/routes/QRCode/QRcodeRouter");
const Employer = require("./models/Employer");
const Workplace = require("./models/Workplace");
const WorksShedule = require("./models/WorkShedule");
const Roles = require("./models/Role");

const moment = require("moment");

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// access control allow origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api", employeeAuthRouter);
app.use("/api", employeeProfileRouter);
app.use("/api", employeeCheckInRouter);
app.use("/api", employeeCheckOutRouter);
app.use("/api", employeeAttendanceHistoryRouter);

app.use("/api", EmployerQRCodeRouter);

sequelize.sync({});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log("server is running");
});
