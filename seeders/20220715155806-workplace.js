"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("workplaces", [
      {
        id: 1,
        name: "digikala",
        QRcode: "QRcode_files/1.png",
        hash: JSON.stringify({
          content:
            "40edbb3727d36c764f7f7dcb634283b5e5d043d1ce928f35262a2afb9374348de90d2415f2c61a251d1b170c02025cb93cf9",
          iv: "6c50d86f0cd11253e1b8afbfd4143662",
        }),
        activityStatus: true,
        employerId: "1",
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
