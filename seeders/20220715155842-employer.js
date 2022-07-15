"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("employers", [
      {
        id: 1,
        email: "niloufar.pa@gmail.com",
        fname: "niloufar",
        lname: "padkan",
        phone: "09227056539",
        otp: "2564",
        roleId: 2,
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
