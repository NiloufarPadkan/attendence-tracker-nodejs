"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("workplaces", [
      {
        id: 1,
        name: "digikala",
        QRcode: "QRcode_files/1.png",
        hash: "5yRv26DGsHSj9Dj5euJFhmU4L58rbhGkaelWG0Ff6wVy0MwrwD",
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
