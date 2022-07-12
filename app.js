const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database/sequelize');
const employeeAuthRouter = require('./app/employee/routes/auth/loginRegisterRouter');

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// access control allow origin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    next();
});

app.use('/api', employeeAuthRouter);

sequelize.sync({});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log('server is running');
});
