const Sequelize = require("sequelize");

const sequelize = require("../config/database/sequelize");
const Employee = require("./Employee");
const Workplace = require("./Workplace");

const WorksShedule = sequelize.define("worksShedule", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  startTime: {
    type: Sequelize.TIME,
  },
  endTime: {
    type: Sequelize.TIME,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.DATE,
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.DATE,
  },
});

Employee.belongsTo(WorksShedule);
WorksShedule.belongsTo(Workplace);
module.exports = WorksShedule;
