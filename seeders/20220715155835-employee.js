"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("employees", [
      {
        id: 1,
        email: "niloufar.pa@gmail.com",
        fname: "niloufar",
        lname: "padkan",
        phone: "09227056539",
        otp: "2564",
        roleId: 3,
        workplaceId: 1,
        workSheduleId: 1,
        activityStatus: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
