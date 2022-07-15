#!/bin/bash
 npx sequelize-cli db:drop
 npx sequelize-cli db:create
 node runningSeeders.js 
 npx sequelize-cli db:seed --seed 20220715155817-roles 20220715155842-employer 20220715155806-workplace 20220715201159-workShedule 20220715155835-employee
