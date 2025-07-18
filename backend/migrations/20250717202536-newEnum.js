'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_expenses_payment_method" ADD VALUE IF NOT EXISTS 'upi';
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "expenses" ALTER COLUMN "payment_method" SET DEFAULT 'upi';
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "expenses" ALTER COLUMN "payment_method" SET DEFAULT 'cash';
    `);

    // Note: Removing a value from an ENUM is complex and often
    // omitted in 'down' migrations unless absolutely necessary.
  }
};