"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("roles", [
      {
        role: "root",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: "employer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: "employee",
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
