@echo off
CALL  npx sequelize-cli db:drop

CALL  npx sequelize-cli db:create

CALL  node runningSeeders.js 

CALL  npx sequelize-cli db:seed --seed 20220715155817-roles 20220715155842-employer 20220715155806-workplace 20220715201159-workShedule 20220715155835-employee

pause
