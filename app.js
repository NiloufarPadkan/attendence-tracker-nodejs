const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/database/sequelize");
const employeeAuthRouter = require("./app/employee/routes/auth/loginRegisterRouter");
const employeeProfileRouter = require("./app/employee/routes/employee/profileRouter");
const employeeScheduleRouter = require("./app/employee/routes/employee/workScheduleRouter");
const employeeCheckInRouter = require("./app/employee/routes/workplace/check-inRouter");
const employeeCheckOutRouter = require("./app/employee/routes/workplace/check-outRouter");
const employeeAttendanceHistoryRouter = require("./app/employee/routes/attendance/attendanceRouter");
const employeeLeaveRouter = require("./app/employee/routes/leave/leave");
const EmployerQRCodeRouter = require("./app/employer/routes/QRCode/QRcodeRouter");
const EmployerAuthRouter = require("./app/employer/routes/auth/loginRegisterRouter");
const EmployerStaffRouter = require("./app/employer/routes/workplace/staff/staffRouter");
const EmployerWorkPlaveRouter = require("./app/employer/routes/workplace/workplacerouter");
const EmployerLeaveRouter = require("./app/employer/routes/leave/leaveRouter");
const EmployerProfileRouter = require("./app/employer/routes/employer/profileRouter");
const Employer = require("./models/Employer");
const Workplace = require("./models/Workplace");
const WorksSchedule = require("./models/WorkSchedule");
const Roles = require("./models/Role");

const moment = require("moment");
const Employee = require("./models/Employee");

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
app.use("/api", employeeScheduleRouter);
app.use("/api", employeeLeaveRouter);

app.use("/api", EmployerQRCodeRouter);
app.use("/api", EmployerAuthRouter);
app.use("/api", EmployerLeaveRouter);
app.use("/api", EmployerStaffRouter);
app.use("/api", EmployerWorkPlaveRouter);
app.use("/api", EmployerWorkPlaveRouter);
app.use("/api", EmployerProfileRouter);

app.get("/api/employees", async (req, res) => {
  let employee = await Employee.findAll({});
  res.send(employee);
});
sequelize.sync({});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log("server is running on port " + port);
});
