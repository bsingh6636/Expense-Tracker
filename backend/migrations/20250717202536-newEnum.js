'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('expenses', 'payment_method', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'upi'
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE expenses
      ADD CONSTRAINT chk_payment_method
      CHECK (payment_method IN ('cash', 'credit_card', 'debit_card', 'online_transfer', 'other', 'upi'))
`);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
