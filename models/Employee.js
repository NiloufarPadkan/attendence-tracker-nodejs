const Sequelize = require('sequelize');

const sequelize = require('../config/database/sequelize');
const Role = require('./Role');

const Employee = sequelize.define('employee', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        trim: true,
        unique: true
    },
    fname: {
        type: Sequelize.STRING,
        trim: true
    },
    lname: {
        type: Sequelize.STRING,
        trim: true
    },
    phone: {
        type: Sequelize.STRING,
        trim: true,
        unique: true
    },
    otp: {
        type: Sequelize.STRING,
    },

    activityStatus: { type: Sequelize.BOOLEAN, defaultValue: true }
});

Employee.belongsTo(Role)
module.exports = Employee;
