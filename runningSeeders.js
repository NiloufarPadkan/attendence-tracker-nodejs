const { spawn } = require("child_process");
const ls = spawn("node", ["app.js"]);
const sequelize = require("./config/database/sequelize");

ls.stdout.on("data", (data) => {
  console.log(`${data}`);
});

setTimeout(() => {
  ls.kill();
  sequelize.drop();
}, 5000);
